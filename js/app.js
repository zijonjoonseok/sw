// js/app.js
(function() {
    // Current application state
    let state = {
        currentUser: null,
        activeFilters: {
            query: '',
            category: '전체',
            type: '전체',
            status: '전체'
        },
        currentSort: 'latest',
        activeStudyId: null
    };

    // Initialize application
    function init() {
        // Load user session from db
        state.currentUser = window.AppDB.getCurrentUser();
        
        // Update navbar
        window.AppViews.updateNavbar(state.currentUser);
        
        // Initial routing: if logged in, go to dashboard, else go to search page (guest mode)
        if (state.currentUser) {
            goToDashboard();
        } else {
            goToSearch();
        }

        setupEventListeners();
    }

    // Navigation and Routing functions
    function goToDashboard() {
        if (!state.currentUser) {
            goToAuth(false);
            return;
        }
        const studies = window.AppDB.getStudies();
        const notifications = window.AppDB.getUserNotifications(state.currentUser.email);
        const applications = window.AppDB.getApplications();
        window.AppViews.renderDashboard(state.currentUser, studies, notifications, applications);
    }

    function goToSearch() {
        const studies = window.AppDB.getStudies();
        window.AppViews.renderSearch(studies, state.activeFilters, state.currentSort);
    }

    function goToInterests() {
        if (!state.currentUser) {
            goToAuth(false);
            return;
        }
        window.AppViews.renderInterests(state.currentUser);
    }

    function goToDetail(studyId) {
        const study = window.AppDB.getStudyById(studyId);
        if (!study) return;

        state.activeStudyId = studyId;
        
        let appStatus = null;
        if (state.currentUser) {
            const apps = window.AppDB.getApplications();
            const myApp = apps.find(a => a.studyId === studyId && a.applicantEmail === state.currentUser.email);
            if (myApp) {
                appStatus = myApp.status;
            }
        }
        
        window.AppViews.renderDetail(study, state.currentUser || { email: '' }, appStatus);
    }

    function goToChat(studyId) {
        if (!state.currentUser) {
            goToAuth(false);
            return;
        }
        const study = window.AppDB.getStudyById(studyId);
        if (!study || !study.members.includes(state.currentUser.email)) {
            alert('이 스터디의 정식 멤버만 채팅방에 입장할 수 있습니다.');
            return;
        }

        state.activeStudyId = studyId;
        const messages = window.AppDB.getStudyChats(studyId);
        window.AppViews.renderChat(study, messages, state.currentUser);
    }

    function goToAuth(isRegister = false) {
        window.AppViews.renderAuth(isRegister);
    }

    // Set up Global Event Listeners
    function setupEventListeners() {
        // Document level delegation for dynamic elements
        document.addEventListener('click', function(e) {
            
            // Logo Click
            if (e.target.closest('#nav-logo')) {
                if (state.currentUser) goToDashboard();
                else goToSearch();
            }

            // Navbar links click
            if (e.target.id === 'nav-dashboard') {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
                goToDashboard();
            }
            if (e.target.id === 'nav-search' || e.target.id === 'nav-search-guest') {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                if (document.getElementById('nav-search')) {
                    document.getElementById('nav-search').classList.add('active');
                }
                goToSearch();
            }
            if (e.target.id === 'nav-interests') {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
                goToInterests();
            }

            // Navigation Auth buttons
            if (e.target.id === 'nav-login-btn' || e.target.id === 'go-to-signin') {
                e.preventDefault();
                goToAuth(false);
            }
            if (e.target.id === 'nav-signup-btn' || e.target.id === 'go-to-signup') {
                e.preventDefault();
                goToAuth(true);
            }

            // Logout
            if (e.target.id === 'logout-btn') {
                window.AppDB.setCurrentUser(null);
                state.currentUser = null;
                window.AppViews.updateNavbar(null);
                goToSearch();
            }

            // Study Card click (except chat and detail button specifically to avoid double clicks)
            const studyCard = e.target.closest('.study-card');
            if (studyCard && !e.target.classList.contains('enter-chat-btn') && !e.target.classList.contains('detail-view-btn')) {
                const studyId = studyCard.getAttribute('data-id');
                goToDetail(studyId);
            }

            // "Detail View" Button
            if (e.target.classList.contains('detail-view-btn')) {
                const studyId = e.target.getAttribute('data-id');
                goToDetail(studyId);
            }

            // "Back to Search" in detail page
            if (e.target.id === 'back-to-search-btn') {
                e.preventDefault();
                goToSearch();
            }

            // "Back to Dashboard" from chat page
            if (e.target.id === 'back-to-dashboard-from-chat') {
                e.preventDefault();
                goToDashboard();
            }

            // Enter Chat Room button
            if (e.target.classList.contains('enter-chat-btn')) {
                const studyId = e.target.getAttribute('data-id');
                goToChat(studyId);
            }

            // Open/Close study creation modal
            if (e.target.id === 'open-create-study-btn') {
                document.getElementById('create-study-modal').classList.add('active');
            }
            if (e.target.id === 'close-create-modal' || e.target.id === 'cancel-create-modal' || e.target.id === 'create-study-modal') {
                if (e.target === e.currentTarget || e.target.id === 'close-create-modal' || e.target.id === 'cancel-create-modal' || e.target.id === 'create-study-modal') {
                    document.getElementById('create-study-modal').classList.remove('active');
                }
            }

            // Cancel interests modification
            if (e.target.id === 'cancel-interests-btn') {
                goToDashboard();
            }

            // Category tag click in Interest setup
            if (e.target.classList.contains('category-select-item')) {
                e.target.classList.toggle('selected');
            }

            // Tag selection item in Interest setup
            if (e.target.classList.contains('tag-select-item')) {
                if (e.target.querySelector('.remove-custom-tag')) {
                    // It is a custom tag removal click
                    return; 
                }
                e.target.classList.toggle('selected');
            }

            // Schedule tag click in Interest setup
            if (e.target.classList.contains('schedule-select-item')) {
                e.target.classList.toggle('selected');
            }

            // Location preference tag click in Interest setup (Single choice)
            if (e.target.classList.contains('location-select-item')) {
                document.querySelectorAll('.location-select-item').forEach(el => el.classList.remove('selected'));
                e.target.classList.add('selected');
            }

            // Add Custom Tag button in Interest setup
            if (e.target.id === 'add-custom-tag-btn') {
                addCustomTag();
            }

            // Remove Custom Tag click
            if (e.target.classList.contains('remove-custom-tag')) {
                e.stopPropagation();
                e.target.parentElement.remove();
            }

            // Go to Search button from Dashboard hero
            if (e.target.id === 'go-to-search-btn') {
                goToSearch();
            }

            // Apply study button click
            if (e.target.id === 'apply-study-btn') {
                applyToStudy(e.target.getAttribute('data-id'));
            }

            // Click on Notification item to mark as read and navigate
            const notiItem = e.target.closest('.click-noti');
            if (notiItem) {
                const notiId = notiItem.getAttribute('data-id');
                const link = notiItem.getAttribute('data-link');
                window.AppDB.markNotificationAsRead(notiId);
                
                if (link) {
                    if (link.startsWith('study:')) {
                        goToDetail(link.split(':')[1]);
                    } else if (link.startsWith('chat:')) {
                        goToChat(link.split(':')[1]);
                    }
                } else {
                    goToDashboard();
                }
            }

            // Review application: ACCEPT
            if (e.target.classList.contains('accept-app-btn')) {
                const appId = e.target.getAttribute('data-id');
                reviewApplication(appId, '승인 완료');
            }

            // Review application: REJECT
            if (e.target.classList.contains('reject-app-btn')) {
                const appId = e.target.getAttribute('data-id');
                reviewApplication(appId, '거절');
            }

            // Category Tab filter click in Search page
            if (e.target.classList.contains('search-cat-tab')) {
                document.querySelectorAll('.search-cat-tab').forEach(t => t.classList.remove('selected'));
                e.target.classList.add('selected');
                state.activeFilters.category = e.target.getAttribute('data-category');
                goToSearch();
            }

        });

        // Auth Submits (LoginForm / SignupForm)
        document.addEventListener('submit', function(e) {
            // LOGIN SUBMIT
            if (e.target.id === 'signin-form') {
                e.preventDefault();
                handleSignIn();
            }

            // REGISTER SUBMIT
            if (e.target.id === 'signup-form') {
                e.preventDefault();
                handleSignUp();
            }

            // INTERESTS PROFILE SETTINGS SUBMIT
            if (e.target.id === 'interests-form') {
                e.preventDefault();
                handleSaveInterests();
            }

            // CREATE STUDY MODAL SUBMIT
            if (e.target.id === 'create-study-form') {
                e.preventDefault();
                handleCreateStudy();
            }

            // CHAT SEND MESSAGE SUBMIT
            if (e.target.id === 'chat-input-form') {
                e.preventDefault();
                handleSendChatMessage();
            }
        });

        // Inputs & Filters listeners (Search, type, status, sort)
        document.addEventListener('input', function(e) {
            if (e.target.id === 'search-input') {
                state.activeFilters.query = e.target.value;
                goToSearch();
            }
        });

        document.addEventListener('change', function(e) {
            if (e.target.id === 'filter-type') {
                state.activeFilters.type = e.target.value;
                goToSearch();
            }
            if (e.target.id === 'filter-status') {
                state.activeFilters.status = e.target.value;
                goToSearch();
            }
            if (e.target.id === 'sort-select') {
                state.currentSort = e.target.value;
                goToSearch();
            }
        });
    }

    // --- FORM ACTIONS IMPLEMENTATION ---

    // Sign In Logic
    function handleSignIn() {
        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value;
        const rememberMe = document.getElementById('signin-remember').checked;

        const user = window.AppDB.getUserByEmail(email);

        if (!user || user.password !== password) {
            alert('이메일 또는 비밀번호가 틀렸습니다. 다시 확인해 주세요.');
            return;
        }

        // Save session state
        window.AppDB.setCurrentUser(user);
        state.currentUser = user;
        
        // Update navbar UI
        window.AppViews.updateNavbar(user);
        
        // If interest categories are not setup, redirect to interest page
        if (!user.interests || !user.interests.categories || user.interests.categories.length === 0) {
            alert('환영합니다! 맞춤형 스터디 추천을 위해 첫 관심 분야를 등록해 주세요.');
            goToInterests();
        } else {
            goToDashboard();
        }
    }

    // Sign Up Logic
    function handleSignUp() {
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const passwordConfirm = document.getElementById('signup-password-confirm').value;
        const nickname = document.getElementById('signup-nickname').value.trim();
        const dept = document.getElementById('signup-dept').value;
        const year = document.getElementById('signup-year').value;

        // Reset errors
        document.getElementById('email-error').style.display = 'none';
        document.getElementById('pw-error').style.display = 'none';
        document.getElementById('nickname-error').style.display = 'none';

        // 1. Email format verification
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ac\.kr|edu)$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-error').style.display = 'inline-block';
            return;
        }

        // 2. Password matching
        if (password !== passwordConfirm) {
            document.getElementById('pw-error').style.display = 'inline-block';
            return;
        }

        // 3. Nickname dup check
        const users = window.AppDB.getUsers();
        if (users.some(u => u.nickname === nickname)) {
            document.getElementById('nickname-error').style.display = 'inline-block';
            return;
        }

        // Create new user object
        const newUser = {
            email,
            password,
            nickname,
            dept,
            year,
            interests: {
                categories: [],
                tags: [],
                schedule: [],
                location: ''
            }
        };

        window.AppDB.saveUser(newUser);
        alert('회원가입이 정상적으로 완료되었습니다! 방금 가입한 정보로 로그인해 주세요.');
        goToAuth(false);
    }

    // Save Interest profile metadata
    function handleSaveInterests() {
        const selectedCategories = [];
        document.querySelectorAll('.category-select-item.selected').forEach(el => {
            selectedCategories.push(el.getAttribute('data-category'));
        });

        const selectedTags = [];
        document.querySelectorAll('.tag-select-item.selected').forEach(el => {
            selectedTags.push(el.getAttribute('data-tag'));
        });

        const selectedSchedule = [];
        document.querySelectorAll('.schedule-select-item.selected').forEach(el => {
            selectedSchedule.push(el.getAttribute('data-schedule'));
        });

        const locationElement = document.querySelector('.location-select-item.selected');
        const selectedLocation = locationElement ? locationElement.getAttribute('data-location') : '';

        // Update current user
        state.currentUser.interests = {
            categories: selectedCategories,
            tags: selectedTags,
            schedule: selectedSchedule,
            location: selectedLocation
        };

        window.AppDB.updateUser(state.currentUser);
        window.AppDB.setCurrentUser(state.currentUser);

        alert('관심 정보 프로필이 업데이트되었습니다!');
        goToDashboard();
    }

    // Add custom tag input in Interest settings
    function addCustomTag() {
        const input = document.getElementById('custom-tag-input');
        const tagText = input.value.trim();
        if (!tagText) return;

        // Verify if it already exists in DOM
        let exists = false;
        document.querySelectorAll('#custom-tags-container .tag-select-item').forEach(el => {
            if (el.getAttribute('data-tag') === tagText) exists = true;
        });

        if (exists) {
            input.value = '';
            return;
        }

        const tagContainer = document.getElementById('custom-tags-container');
        const newTag = document.createElement('div');
        newTag.className = 'selectable-tag tag-select-item selected';
        newTag.setAttribute('data-tag', tagText);
        newTag.innerHTML = `${tagText} <span class="remove-custom-tag" style="margin-left: 6px; font-weight: bold;">&times;</span>`;
        
        tagContainer.appendChild(newTag);
        input.value = '';
    }

    // Create a new Study logic
    function handleCreateStudy() {
        if (!state.currentUser) {
            alert('로그인 후 이용 가능합니다.');
            goToAuth(false);
            return;
        }

        const title = document.getElementById('study-title').value.trim();
        const category = document.getElementById('study-category').value;
        const maxMembers = parseInt(document.getElementById('study-max-members').value);
        const schedule = document.getElementById('study-schedule').value.trim();
        const type = document.getElementById('study-type').value;
        const description = document.getElementById('study-desc').value.trim();

        const newStudy = {
            id: 'study_' + Date.now(),
            title,
            category,
            minMembers: 2,
            maxMembers,
            schedule,
            type,
            description,
            creatorEmail: state.currentUser.email,
            creatorNickname: state.currentUser.nickname,
            status: '모집중',
            createdAt: new Date().toISOString(),
            views: 0,
            members: [state.currentUser.email]
        };

        window.AppDB.saveStudy(newStudy);
        
        // Hide Modal
        document.getElementById('create-study-modal').classList.remove('active');
        // Reset form
        document.getElementById('create-study-form').reset();

        alert(`'${title}' 스터디가 성공적으로 개설되었습니다!`);
        goToDetail(newStudy.id);
    }

    // Apply for study membership
    function applyToStudy(studyId) {
        if (!state.currentUser) {
            alert('로그인 후 스터디에 신청하실 수 있습니다.');
            goToAuth(false);
            return;
        }

        const study = window.AppDB.getStudyById(studyId);
        if (!study) return;

        // Verify if already registered
        const apps = window.AppDB.getApplications();
        const exists = apps.some(a => a.studyId === studyId && a.applicantEmail === state.currentUser.email);
        if (exists) {
            alert('이미 이 스터디에 참가 신청을 보냈습니다.');
            return;
        }

        // Create Application object
        const newApp = {
            id: 'app_' + Date.now(),
            studyId: studyId,
            applicantEmail: state.currentUser.email,
            status: '대기 중',
            timestamp: new Date().toISOString()
        };

        window.AppDB.saveApplication(newApp);

        // Send notification to study owner
        const newNoti = {
            id: 'noti_' + Date.now(),
            toEmail: study.creatorEmail,
            type: '신청 알림',
            title: '📩 스터디 참가 신청 도달',
            message: `<strong>${state.currentUser.nickname}</strong>님이 <strong>[${study.title}]</strong> 스터디에 참가를 희망합니다. 수락/거절을 결정해 주세요.`,
            link: `dashboard`,
            read: false,
            timestamp: new Date().toISOString(),
            data: {
                applicantEmail: state.currentUser.email,
                studyId: studyId
            }
        };
        window.AppDB.saveNotification(newNoti);

        alert('스터디 신청이 완료되었습니다! 방장의 승인을 기다려주세요.');
        goToDetail(studyId);
    }

    // Owner reviews (Accepts / Rejects) applicants
    function reviewApplication(appId, reviewStatus) {
        window.AppDB.updateApplicationStatus(appId, reviewStatus);
        
        const apps = window.AppDB.getApplications();
        const app = apps.find(a => a.id === appId);
        if (!app) return;

        const study = window.AppDB.getStudyById(app.studyId);
        if (!study) return;

        // Notify applicant of the outcome
        const outcomeEmoji = reviewStatus === '승인 완료' ? '🎉' : '❌';
        const outcomeMsg = reviewStatus === '승인 완료' ? 
            `축하합니다! <strong>[${study.title}]</strong> 스터디 참여가 승인되었습니다. 지금 채팅방에 들어가 조원들과 이야기를 나눠보세요!` : 
            `아쉽게도 <strong>[${study.title}]</strong> 스터디의 참여 승인이 거절되었습니다. 다른 스터디를 신청해 보세요.`;
        
        const linkPath = reviewStatus === '승인 완료' ? `chat:${study.id}` : `study:${study.id}`;

        const newNoti = {
            id: 'noti_' + Date.now(),
            toEmail: app.applicantEmail,
            type: reviewStatus,
            title: `${outcomeEmoji} 스터디 신청 결과 도착`,
            message: outcomeMsg,
            link: linkPath,
            read: false,
            timestamp: new Date().toISOString()
        };
        window.AppDB.saveNotification(newNoti);

        alert(`신청서가 [${reviewStatus}] 처리되었습니다.`);
        goToDashboard();
    }

    // Send Chat Message
    function handleSendChatMessage() {
        const input = document.getElementById('chat-msg-input');
        const text = input.value.trim();
        if (!text || !state.activeStudyId || !state.currentUser) return;

        const newMessage = {
            id: 'msg_' + Date.now(),
            senderEmail: state.currentUser.email,
            senderNickname: state.currentUser.nickname,
            message: text,
            timestamp: new Date().toISOString()
        };

        window.AppDB.saveChatMessage(state.activeStudyId, newMessage);
        input.value = '';

        // Re-render chat
        const study = window.AppDB.getStudyById(state.activeStudyId);
        const messages = window.AppDB.getStudyChats(state.activeStudyId);
        window.AppViews.renderChat(study, messages, state.currentUser);

        // Simulation: Send automated dummy answer after 1.5 seconds from a different member
        simulateMockChatReply(study);
    }

    // Simulates an interactive mock response in the active chat room after 1.5 seconds
    function simulateMockChatReply(study) {
        const otherMembers = study.members.filter(email => email !== state.currentUser.email);
        if (otherMembers.length === 0) return;

        // Choose random member
        const responderEmail = otherMembers[Math.floor(Math.random() * otherMembers.length)];
        const responderObj = window.AppDB.getUserByEmail(responderEmail);
        const responderNickname = responderObj ? responderObj.nickname : '스터디메이트';

        const replies = [
            "우와, 좋은 의견이네요! 다 같이 열심히 해봐요! 👍",
            "확인했습니다! 저도 기말고사 꼭 만점받고 싶어요 ㅠㅠ",
            "네, 첫 오프라인 모임 일정 잡을까요?",
            "반갑습니다! 저는 교재 준비해서 갈게요. 언제 모이는 게 좋으실까요?",
            "와~ 저도 그 파트가 제일 약했는데 같이 풀면 도움 많이 되겠어요!",
            "좋아요! 이번 학기 낙오 없이 끝까지 가봅시다 파이팅!"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        setTimeout(() => {
            // Check if user is still in the same chat room before rendering
            if (state.activeStudyId === study.id && document.getElementById('chat-page').classList.contains('active')) {
                const mockMessage = {
                    id: 'msg_mock_' + Date.now(),
                    senderEmail: responderEmail,
                    senderNickname: responderNickname,
                    message: randomReply,
                    timestamp: new Date().toISOString()
                };

                window.AppDB.saveChatMessage(study.id, mockMessage);
                
                const currentMessages = window.AppDB.getStudyChats(study.id);
                window.AppViews.renderChat(study, currentMessages, state.currentUser);
            }
        }, 1500);
    }

    // Expose init globally
    window.onload = init;
})();
