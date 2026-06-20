// js/views.js
(function() {
    const views = {
        // Switch between SPA pages
        showPage: function(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            const activePage = document.getElementById(pageId);
            if (activePage) {
                activePage.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        // Render Auth Page (Login / Register)
        renderAuth: function(isSignUp = false) {
            const container = document.getElementById('auth-page');
            
            if (isSignUp) {
                container.innerHTML = `
                    <div class="auth-container glass-container">
                        <div class="auth-header">
                            <h2 class="auth-title">회원가입</h2>
                            <p class="auth-subtitle">LinkU에서 함께할 스터디원을 만나보세요!</p>
                        </div>
                        <form id="signup-form">
                            <div class="form-group">
                                <label class="form-label" for="signup-email">학교 이메일</label>
                                <input type="email" id="signup-email" class="form-control" placeholder="example@hanguk.ac.kr" required>
                                <span class="badge badge-danger" id="email-error" style="display:none; margin-top: 5px;">대학 이메일 형식(@*.ac.kr 또는 @*.edu)이어야 합니다.</span>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="signup-password">비밀번호</label>
                                <input type="password" id="signup-password" class="form-control" placeholder="영문, 숫자, 특수문자 조합" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="signup-password-confirm">비밀번호 확인</label>
                                <input type="password" id="signup-password-confirm" class="form-control" placeholder="비밀번호 다시 입력" required>
                                <span class="badge badge-danger" id="pw-error" style="display:none; margin-top: 5px;">비밀번호가 일치하지 않습니다.</span>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="signup-nickname">닉네임</label>
                                    <input type="text" id="signup-nickname" class="form-control" placeholder="닉네임" required>
                                    <span class="badge badge-danger" id="nickname-error" style="display:none; margin-top: 5px;">이미 존재하는 닉네임입니다.</span>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="signup-dept">학과</label>
                                    <select id="signup-dept" class="form-control" required>
                                        <option value="">학과 선택</option>
                                        <option value="컴퓨터공학과">컴퓨터공학과</option>
                                        <option value="경영학과">경영학과</option>
                                        <option value="영어영문학과">영어영문학과</option>
                                        <option value="전자공학과">전자공학과</option>
                                        <option value="디자인학과">디자인학과</option>
                                        <option value="기타">기타 학과</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="signup-year">학번</label>
                                <select id="signup-year" class="form-control" required>
                                    <option value="">학번 선택</option>
                                    <option value="26학번">26학번 (신입생)</option>
                                    <option value="25학번">25학번</option>
                                    <option value="24학번">24학번</option>
                                    <option value="23학번">23학번</option>
                                    <option value="22학번">22학번</option>
                                    <option value="21학번 이전">21학번 이전</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full" style="margin-top: 10px;">가입 완료</button>
                            <p style="text-align: center; font-size: 13px; margin-top: 20px; color: var(--text-muted);">
                                이미 계정이 있으신가요? <a href="#" id="go-to-signin" style="color: var(--primary); font-weight: 700;">로그인하기</a>
                            </p>
                        </form>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="auth-container glass-container">
                        <div class="auth-header">
                            <h2 class="auth-title">로그인</h2>
                            <p class="auth-subtitle">캠퍼스 스터디의 시작, LinkU</p>
                        </div>
                        <form id="signin-form">
                            <div class="form-group">
                                <label class="form-label" for="signin-email">학교 이메일</label>
                                <input type="email" id="signin-email" class="form-control" placeholder="example@hanguk.ac.kr" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="signin-password">비밀번호</label>
                                <input type="password" id="signin-password" class="form-control" placeholder="비밀번호 입력" required>
                            </div>
                            <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="signin-remember" style="width: 16px; height: 16px; accent-color: var(--primary);">
                                <label for="signin-remember" style="font-size: 13px; color: var(--text-muted); cursor: pointer; user-select: none;">로그인 상태 유지</label>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full" style="margin-top: 10px;">로그인</button>
                            <p style="text-align: center; font-size: 13px; margin-top: 20px; color: var(--text-muted);">
                                처음이신가요? <a href="#" id="go-to-signup" style="color: var(--primary); font-weight: 700;">회원가입하기</a>
                            </p>
                        </form>
                    </div>
                `;
            }
            this.showPage('auth-page');
        },

        // Render Interest Profile Registration Page
        renderInterests: function(user) {
            const container = document.getElementById('interests-page');
            
            // Set defaults if user interest metadata doesn't exist
            const activeCategories = (user.interests && user.interests.categories) ? user.interests.categories : [];
            const activeTags = (user.interests && user.interests.tags) ? user.interests.tags : [];
            const activeSchedule = (user.interests && user.interests.schedule) ? user.interests.schedule : [];
            const activeLocation = (user.interests && user.interests.location) ? user.interests.location : '';

            const categories = ['전공', '어학', '자격증', '취업/코딩', '기타'];
            const tags = {
                '전공': ['컴퓨터공학', '경영학', '기계공학', '화학공학', '행정학', '경제학', '통계학'],
                '어학': ['TOEIC', 'TOEFL', 'OPIC', '영어회화', 'JLPT', 'HSK'],
                '자격증': ['정보처리기사', 'SQLD', 'ADsP', '컴활1급', '한능검', '회계관리'],
                '취업/코딩': ['코딩테스트', 'React', 'Node.js', 'Spring', '알고리즘', '포트폴리오', '면접스터디']
            };

            let tagsHtml = '';
            for (let category in tags) {
                tagsHtml += `
                    <div style="margin-bottom: 16px;">
                        <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 8px; color: var(--text-muted);">${category} 분야 태그</h4>
                        <div class="tag-container" style="margin-top:0;">
                            ${tags[category].map(tag => {
                                const isSelected = activeTags.includes(tag) ? 'selected' : '';
                                return `<div class="selectable-tag tag-select-item ${isSelected}" data-tag="${tag}">${tag}</div>`;
                            }).join('')}
                        </div>
                    </div>
                `;
            }

            container.innerHTML = `
                <div style="max-width: 680px; margin: 0 auto;">
                    <div class="dashboard-panel glass-container">
                        <h2 style="font-weight: 800; font-size: 24px; margin-bottom: 8px;">관심 분야 및 선호 일정 설정</h2>
                        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 32px;">선택해 주신 메타데이터를 기반으로 맞춤형 스터디를 대시보드에 추천해 드립니다.</p>
                        
                        <form id="interests-form">
                            <!-- 1. 카테고리 대분류 선택 -->
                            <div class="form-group">
                                <label class="form-label">1. 관심 카테고리 대분류 (중복 선택 가능)</label>
                                <div class="tag-container">
                                    ${categories.map(cat => {
                                        const isSelected = activeCategories.includes(cat) ? 'selected' : '';
                                        return `<div class="selectable-tag category-select-item ${isSelected}" data-category="${cat}">${cat} 스터디</div>`;
                                    }).join('')}
                                </div>
                            </div>

                            <!-- 2. 세부 태그 선택 -->
                            <div class="form-group" style="margin-top: 32px;">
                                <label class="form-label">2. 관심 세부 분야 태그 선택</label>
                                ${tagsHtml}
                                
                                <div class="form-group" style="margin-top: 20px;">
                                    <label class="form-label" style="font-size: 12px;">선택지에 없는 직접 키워드 태그 입력</label>
                                    <div class="custom-tag-group">
                                        <input type="text" id="custom-tag-input" class="form-control" placeholder="예: 앱개발, 데이터사이언스, 스페인어" style="max-width: 320px;">
                                        <button type="button" class="btn btn-secondary btn-sm" id="add-custom-tag-btn">태그 추가</button>
                                    </div>
                                    <div class="tag-container" id="custom-tags-container" style="margin-top: 12px;">
                                        ${activeTags.filter(t => !Object.values(tags).flat().includes(t)).map(tag => {
                                            return `<div class="selectable-tag tag-select-item selected" data-tag="${tag}">${tag} <span class="remove-custom-tag" style="margin-left: 6px; font-weight: bold;">&times;</span></div>`;
                                        }).join('')}
                                    </div>
                                </div>
                            </div>

                            <!-- 3. 선호 일정 및 진행 방식 -->
                            <div class="form-group" style="margin-top: 32px;">
                                <label class="form-label">3. 선호 일정 (요일 & 시간대)</label>
                                <div class="form-row">
                                    <div>
                                        <label class="form-label" style="font-size: 12px; color: var(--text-muted);">선호 요일</label>
                                        <div class="tag-container" style="margin-top: 0;">
                                            <div class="selectable-tag schedule-select-item ${activeSchedule.includes('평일') ? 'selected' : ''}" data-schedule="평일">평일</div>
                                            <div class="selectable-tag schedule-select-item ${activeSchedule.includes('주말') ? 'selected' : ''}" data-schedule="주말">주말</div>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="form-label" style="font-size: 12px; color: var(--text-muted);">선호 시간대</label>
                                        <div class="tag-container" style="margin-top: 0;">
                                            <div class="selectable-tag schedule-select-item ${activeSchedule.includes('오전') ? 'selected' : ''}" data-schedule="오전">오전 (09:00 ~ 12:00)</div>
                                            <div class="selectable-tag schedule-select-item ${activeSchedule.includes('오후') ? 'selected' : ''}" data-schedule="오후">오후 (12:00 ~ 18:00 이후)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group" style="margin-top: 24px;">
                                <label class="form-label">4. 선호 진행 방식</label>
                                <div class="tag-container" style="margin-top: 0;">
                                    <div class="selectable-tag location-select-item ${activeLocation === '대면' ? 'selected' : ''}" data-location="대면">대면 스터디</div>
                                    <div class="selectable-tag location-select-item ${activeLocation === '비대면' ? 'selected' : ''}" data-location="비대면">온라인 (비대면) 스터디</div>
                                    <div class="selectable-tag location-select-item ${activeLocation === '상관없음' ? 'selected' : ''}" data-location="상관없음">상관없음</div>
                                </div>
                            </div>

                            <div style="display: flex; justify-content: flex-end; gap: 16px; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 24px;">
                                <button type="button" class="btn btn-secondary" id="cancel-interests-btn">취소</button>
                                <button type="submit" class="btn btn-primary">설정 저장 및 메인으로 이동</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            this.showPage('interests-page');
        },

        // Render Dashboard Page
        renderDashboard: function(user, studies, notifications, applications) {
            const container = document.getElementById('dashboard-page');

            // 1. Filter recommended studies based on user interests
            let recommended = [];
            const userInterests = user.interests || { categories: [], tags: [], schedule: [], location: '' };
            
            if (userInterests.categories.length > 0 || userInterests.tags.length > 0) {
                recommended = studies.filter(study => {
                    // Don't recommend studies user is already a member of
                    if (study.members.includes(user.email)) return false;
                    
                    const catMatch = userInterests.categories.includes(study.category);
                    const tagMatch = userInterests.tags.some(tag => study.title.includes(tag) || study.description.includes(tag));
                    const locMatch = userInterests.location === '상관없음' || !userInterests.location || study.type === userInterests.location;
                    
                    return (catMatch || tagMatch) && locMatch;
                }).slice(0, 3); // top 3 recommendations
            }
            
            // Default recommendations if no matches found
            if (recommended.length === 0) {
                recommended = studies.filter(s => !s.members.includes(user.email)).slice(0, 3);
            }

            // 2. My Studies (Created by me or joined by me)
            const myStudies = studies.filter(study => study.members.includes(user.email));

            // 3. Submissions / Approvals for Owner (Applications submitted to studies created by this user)
            const createdStudyIds = studies.filter(s => s.creatorEmail === user.email).map(s => s.id);
            const incomingApplications = applications.filter(app => createdStudyIds.includes(app.studyId) && app.status === '대기 중');

            // HTML for Incoming Applications (Owner review panel)
            let incomingAppsHtml = '';
            if (incomingApplications.length > 0) {
                incomingAppsHtml = `
                    <div class="dashboard-panel glass-container" style="border-color: rgba(168, 85, 247, 0.3);">
                        <h3 class="section-title" style="color: var(--secondary);">👋 스터디 신청 승인 대기 목록</h3>
                        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">내가 개설한 스터디에 참여하고자 하는 학생들의 신청서입니다.</p>
                        <div>
                            ${incomingApplications.map(app => {
                                const studyObj = studies.find(s => s.id === app.studyId);
                                const applicantObj = window.AppDB.getUserByEmail(app.applicantEmail);
                                const applicantNick = applicantObj ? applicantObj.nickname : app.applicantEmail;
                                const applicantDept = applicantObj ? `${applicantObj.dept} (${applicantObj.year})` : '';
                                
                                return `
                                    <div class="notification-item" style="background-color: white;">
                                        <div class="noti-icon" style="background-color: var(--secondary-light); color: var(--secondary);">✍</div>
                                        <div class="noti-content">
                                            <div class="noti-title">${applicantNick} (${applicantDept})</div>
                                            <div class="noti-desc">스터디 <strong>[${studyObj ? studyObj.title : '삭제된 스터디'}]</strong>에 참여를 신청했습니다.</div>
                                            <div class="noti-actions">
                                                <button class="btn btn-primary btn-sm accept-app-btn" data-id="${app.id}">승인</button>
                                                <button class="btn btn-danger btn-sm reject-app-btn" data-id="${app.id}">거절</button>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }

            // HTML for My Studies Cards
            let myStudiesHtml = '';
            if (myStudies.length > 0) {
                myStudiesHtml = `
                    <div class="grid-cols-3">
                        ${myStudies.map(study => {
                            const isOwner = study.creatorEmail === user.email;
                            const badgeClass = isOwner ? 'badge-primary' : 'badge-secondary';
                            const badgeText = isOwner ? '👑 방장' : '👥 참여 스터디';
                            
                            return `
                                <div class="study-card glass-container" data-id="${study.id}">
                                    <div>
                                        <div class="study-card-header">
                                            <span class="badge ${badgeClass}">${badgeText}</span>
                                            <span class="badge badge-success">${study.status}</span>
                                        </div>
                                        <h3 class="study-title">${study.title}</h3>
                                        <div class="study-info-list">
                                            <div class="study-info-item">
                                                <span>📂</span> <strong>${study.category}</strong>
                                            </div>
                                            <div class="study-info-item">
                                                <span>📍</span> ${study.type}
                                            </div>
                                            <div class="study-info-item">
                                                <span>📅</span> ${study.schedule}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="study-card-footer">
                                        <div class="author-info">
                                            <div class="author-avatar">${study.creatorNickname[0]}</div>
                                            <span class="author-name">${study.creatorNickname}</span>
                                        </div>
                                        <button class="btn btn-secondary btn-sm enter-chat-btn" data-id="${study.id}">💬 채팅방</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            } else {
                myStudiesHtml = `
                    <div class="empty-state">
                        <span class="empty-state-icon">🔍</span>
                        <div class="empty-state-text">아직 참가하거나 개설한 스터디가 없습니다. 관심 있는 스터디를 탐색해 보세요!</div>
                    </div>
                `;
            }

            // HTML for Recommended Studies
            let recommendedHtml = '';
            if (recommended.length > 0) {
                recommendedHtml = `
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${recommended.map(study => {
                            return `
                                <div class="study-card glass-container" data-id="${study.id}">
                                    <div>
                                        <div class="study-card-header">
                                            <span class="badge badge-primary">${study.category}</span>
                                            <span class="badge badge-success">${study.status}</span>
                                        </div>
                                        <h3 class="study-title" style="font-size: 16px;">${study.title}</h3>
                                        <div class="study-info-list" style="margin-bottom: 12px; gap: 6px; font-size: 12px;">
                                            <div class="study-info-item"><span>📍</span> ${study.type}</div>
                                            <div class="study-info-item"><span>👥</span> 인원: ${study.members.length} / ${study.maxMembers}명</div>
                                        </div>
                                    </div>
                                    <div class="study-card-footer" style="padding-top: 10px;">
                                        <div class="author-info">
                                            <span class="author-name" style="font-size: 11px; color: var(--text-muted)">방장: ${study.creatorNickname}</span>
                                        </div>
                                        <span style="font-size: 11px; color: var(--primary); font-weight:700;">상세보기 &rarr;</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            } else {
                recommendedHtml = `
                    <div class="empty-state" style="padding: 20px;">
                        <div class="empty-state-text" style="font-size: 12px;">추천할 만한 스터디가 아직 없습니다.</div>
                    </div>
                `;
            }

            // HTML for User Notifications List
            const unreadNotis = notifications.filter(n => !n.read);
            let notiHtml = '';
            if (notifications.length > 0) {
                notiHtml = `
                    <div style="max-height: 380px; overflow-y: auto; padding-right: 4px;">
                        ${notifications.map(noti => {
                            const bgStyle = noti.read ? '' : 'style="background-color: rgba(99, 102, 241, 0.05); border-left: 3px solid var(--primary);"';
                            const iconEmoji = noti.type === '승인 완료' ? '🎉' : noti.type === '거절' ? '❌' : '🔔';
                            
                            return `
                                <div class="notification-item click-noti" data-id="${noti.id}" data-link="${noti.link || ''}" ${bgStyle}>
                                    <div class="noti-icon" style="background-color: var(--primary-light); color: var(--primary);">${iconEmoji}</div>
                                    <div class="noti-content">
                                        <div class="noti-title">${noti.title}</div>
                                        <div class="noti-desc">${noti.message}</div>
                                        <div class="noti-time">${new Date(noti.timestamp).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            } else {
                notiHtml = `
                    <div class="empty-state" style="padding: 20px;">
                        <span class="empty-state-icon" style="font-size: 24px;">🔔</span>
                        <div class="empty-state-text" style="font-size: 12px;">새로운 알림이 없습니다.</div>
                    </div>
                `;
            }

            container.innerHTML = `
                <!-- Hero Banner -->
                <div class="hero-banner glass-container">
                    <div class="hero-text">
                        <h1>안녕하세요, ${user.nickname}님! 👋</h1>
                        <p>${user.dept} (${user.year}) | 목표를 향해 함께 나아갈 동료들을 만나보세요.</p>
                    </div>
                    <div>
                        <button class="btn btn-primary" id="open-create-study-btn">➕ 스터디 만들기</button>
                    </div>
                </div>

                <!-- Owner Review Panel if any applications exist -->
                ${incomingAppsHtml}

                <!-- Dashboard Content Layout -->
                <div class="dashboard-grid">
                    <!-- Left: My Studies List -->
                    <div>
                        <div class="section-header">
                            <h2 class="section-title">📚 나의 스터디 현황</h2>
                            <button class="btn btn-secondary btn-sm" id="go-to-search-btn">🔍 스터디 탐색하기</button>
                        </div>
                        ${myStudiesHtml}
                    </div>

                    <!-- Right: Recommended & Notifications -->
                    <div>
                        <!-- Recommended Panel -->
                        <div class="dashboard-panel glass-container">
                            <h3 class="section-title" style="margin-bottom: 16px; font-size: 16px;">🎯 맞춤 추천 스터디</h3>
                            ${recommendedHtml}
                        </div>

                        <!-- Notifications Panel -->
                        <div class="dashboard-panel glass-container">
                            <div class="section-header" style="margin-bottom: 16px;">
                                <h3 class="section-title" style="font-size: 16px;">🔔 알림 센터</h3>
                                ${unreadNotis.length > 0 ? `<span class="badge badge-danger">${unreadNotis.length}개 안읽음</span>` : ''}
                            </div>
                            ${notiHtml}
                        </div>
                    </div>
                </div>
            `;
            this.showPage('dashboard-page');
        },

        // Render Search / Filter Page
        renderSearch: function(studies, activeFilters = {}, currentSort = 'latest') {
            const container = document.getElementById('search-page');

            // Active categories selection for buttons
            const categories = ['전체', '전공', '어학', '자격증', '취업/코딩', '기타'];
            const activeCategory = activeFilters.category || '전체';

            // Filter studies
            let filteredStudies = [...studies];
            
            // Search text
            if (activeFilters.query) {
                const q = activeFilters.query.toLowerCase();
                filteredStudies = filteredStudies.filter(s => 
                    s.title.toLowerCase().includes(q) || 
                    s.description.toLowerCase().includes(q) || 
                    s.creatorNickname.toLowerCase().includes(q)
                );
            }

            // Category filter
            if (activeCategory !== '전체') {
                filteredStudies = filteredStudies.filter(s => s.category === activeCategory);
            }

            // Study Type filter
            if (activeFilters.type && activeFilters.type !== '전체') {
                filteredStudies = filteredStudies.filter(s => s.type === activeFilters.type);
            }

            // Status filter (Recruiting vs Closed)
            if (activeFilters.status && activeFilters.status !== '전체') {
                filteredStudies = filteredStudies.filter(s => s.status === activeFilters.status);
            }

            // Sorting
            if (currentSort === 'latest') {
                filteredStudies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (currentSort === 'views') {
                filteredStudies.sort((a, b) => b.views - a.views);
            } else if (currentSort === 'popular') {
                filteredStudies.sort((a, b) => b.members.length - a.members.length);
            } else if (currentSort === 'deadline') {
                // Closing soon (urgency based on spaces remaining)
                filteredStudies.sort((a, b) => {
                    const remainingA = a.maxMembers - a.members.length;
                    const remainingB = b.maxMembers - b.members.length;
                    return remainingA - remainingB;
                });
            }

            container.innerHTML = `
                <div class="section-header" style="margin-bottom: 16px;">
                    <h2 class="section-title">🔍 스터디 탐색</h2>
                    <p style="color: var(--text-muted); font-size: 14px;">대학 동료들과 함께 효율적으로 공부해보세요.</p>
                </div>

                <!-- Custom Grid Filter Panel -->
                <div class="search-filter-panel glass-container">
                    <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label" style="font-size: 11px;">검색어</label>
                        <input type="text" id="search-input" class="form-control" placeholder="키워드 또는 개설자 검색" value="${activeFilters.query || ''}">
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label" style="font-size: 11px;">진행 방식</label>
                        <select id="filter-type" class="form-control">
                            <option value="전체" ${activeFilters.type === '전체' ? 'selected' : ''}>온/오프라인 전체</option>
                            <option value="대면" ${activeFilters.type === '대면' ? 'selected' : ''}>대면</option>
                            <option value="비대면" ${activeFilters.type === '비대면' ? 'selected' : ''}>비대면</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label" style="font-size: 11px;">모집 상태</label>
                        <select id="filter-status" class="form-control">
                            <option value="전체" ${activeFilters.status === '전체' ? 'selected' : ''}>모집 전체</option>
                            <option value="모집중" ${activeFilters.status === '모집중' ? 'selected' : ''}>모집 중</option>
                            <option value="모집완료" ${activeFilters.status === '모집완료' ? 'selected' : ''}>모집 마감</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label" style="font-size: 11px;">정렬 기준</label>
                        <select id="sort-select" class="form-control">
                            <option value="latest" ${currentSort === 'latest' ? 'selected' : ''}>최신 등록순</option>
                            <option value="views" ${currentSort === 'views' ? 'selected' : ''}>인기 조회순</option>
                            <option value="popular" ${currentSort === 'popular' ? 'selected' : ''}>참여 인원순</option>
                            <option value="deadline" ${currentSort === 'deadline' ? 'selected' : ''}>마감 임박순</option>
                        </select>
                    </div>
                </div>

                <!-- Category Tabs -->
                <div class="tag-container" style="margin-bottom: 32px;">
                    ${categories.map(cat => {
                        const isSelected = activeCategory === cat ? 'selected' : '';
                        return `<div class="selectable-tag search-cat-tab ${isSelected}" data-category="${cat}">${cat} ${cat === '전체' ? '' : '스터디'}</div>`;
                    }).join('')}
                </div>

                <!-- Studies Grid List -->
                ${filteredStudies.length > 0 ? `
                    <div class="grid-cols-3">
                        ${filteredStudies.map(study => {
                            const isFull = study.members.length >= study.maxMembers;
                            const badgeColor = isFull ? 'badge-danger' : 'badge-success';
                            const badgeText = isFull ? '모집완료' : '모집중';
                            
                            return `
                                <div class="study-card glass-container" data-id="${study.id}">
                                    <div>
                                        <div class="study-card-header">
                                            <span class="badge badge-primary">${study.category}</span>
                                            <span class="badge ${badgeColor}">${badgeText}</span>
                                        </div>
                                        <h3 class="study-title">${study.title}</h3>
                                        <div class="study-info-list">
                                            <div class="study-info-item">
                                                <span>📍</span> ${study.type} 스터디
                                            </div>
                                            <div class="study-info-item">
                                                <span>👥</span> 모집인원: ${study.members.length} / ${study.maxMembers}명
                                            </div>
                                            <div class="study-info-item">
                                                <span>📅</span> 일정: ${study.schedule}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="study-card-footer">
                                        <div class="author-info">
                                            <div class="author-avatar">${study.creatorNickname[0]}</div>
                                            <div style="display:flex; flex-direction:column;">
                                                <span class="author-name">${study.creatorNickname}</span>
                                                <span style="font-size:10px; color:var(--text-muted)">조회수 ${study.views}</span>
                                            </div>
                                        </div>
                                        <button class="btn btn-secondary btn-sm detail-view-btn" data-id="${study.id}">자세히 보기</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <span class="empty-state-icon">🫙</span>
                        <div class="empty-state-text">조건에 맞는 스터디 모집글이 존재하지 않습니다. 직접 개설해 보시겠어요?</div>
                    </div>
                `}
            `;
            this.showPage('search-page');
        },

        // Render Study Detail Page
        renderDetail: function(study, currentUser, appStatus = null) {
            const container = document.getElementById('detail-page');

            const isCreator = study.creatorEmail === currentUser.email;
            const isMember = study.members.includes(currentUser.email);
            
            // Increment views in local memory
            study.views = (study.views || 0) + 1;
            window.AppDB.updateStudy(study);

            // Fetch info of current study members
            const memberProfiles = study.members.map(email => {
                const userObj = window.AppDB.getUserByEmail(email);
                return {
                    email,
                    nickname: userObj ? userObj.nickname : email,
                    dept: userObj ? userObj.dept : '비공개 학과',
                    year: userObj ? userObj.year : '',
                    isCreator: email === study.creatorEmail
                };
            });

            // Action Button UI based on user role and application status
            let actionBtnHtml = '';
            if (isCreator) {
                actionBtnHtml = `
                    <button class="btn btn-secondary btn-full" id="edit-study-btn" data-id="${study.id}">⚙ 스터디 설정 관리</button>
                    <button class="btn btn-primary btn-full enter-chat-btn" data-id="${study.id}" style="margin-top: 12px;">💬 스터디 채팅방으로 이동</button>
                `;
            } else if (isMember) {
                actionBtnHtml = `
                    <span class="badge badge-success" style="display:block; text-align:center; padding:12px; margin-bottom:12px; font-size:13px;">👥 이미 스터디원입니다</span>
                    <button class="btn btn-primary btn-full enter-chat-btn" data-id="${study.id}">💬 스터디 채팅방 입장</button>
                `;
            } else if (appStatus === '대기 중') {
                actionBtnHtml = `
                    <button class="btn btn-secondary btn-full" disabled style="opacity: 0.7; cursor: not-allowed;">⏳ 가입 승인 대기 중</button>
                    <p style="font-size:11px; color:var(--text-muted); text-align:center; margin-top:8px;">방장이 가입 요청을 승인하면 채팅방에 입장할 수 있습니다.</p>
                `;
            } else if (appStatus === '거절') {
                actionBtnHtml = `
                    <button class="btn btn-danger btn-full" disabled style="opacity: 0.7; cursor: not-allowed;">❌ 가입 신청 거절됨</button>
                `;
            } else {
                const isFull = study.members.length >= study.maxMembers;
                if (isFull) {
                    actionBtnHtml = `
                        <button class="btn btn-secondary btn-full" disabled style="opacity: 0.7; cursor: not-allowed;">🔒 모집이 완료된 스터디입니다</button>
                    `;
                } else {
                    actionBtnHtml = `
                        <button class="btn btn-primary btn-full" id="apply-study-btn" data-id="${study.id}">✍ 스터디 참가 신청하기</button>
                    `;
                }
            }

            container.innerHTML = `
                <div style="margin-bottom: 24px;">
                    <a href="#" id="back-to-search-btn" style="color:var(--text-muted); font-size:14px; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
                        &larr; 스터디 탐색 리스트로 돌아가기
                    </a>
                </div>

                <div class="detail-layout">
                    <!-- Left Column: Study detailed spec -->
                    <div class="detail-main glass-container">
                        <div class="detail-meta">
                            <span class="badge badge-primary">${study.category}</span>
                            <span class="badge badge-success">${study.status}</span>
                            <span style="font-size: 13px; color: var(--text-muted); margin-left: auto;">등록일: ${new Date(study.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <h1 class="detail-title">${study.title}</h1>
                        
                        <!-- Mini details -->
                        <div class="grid-cols-3" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 32px; gap: 16px;">
                            <div style="background-color:rgba(99, 102, 241, 0.05); padding:16px; border-radius:var(--radius-sm); text-align:center;">
                                <span style="font-size:20px; display:block; margin-bottom:6px;">📍</span>
                                <span style="font-size:11px; color:var(--text-muted);">진행 방식</span>
                                <strong style="display:block; font-size:14px; margin-top:4px;">${study.type}</strong>
                            </div>
                            <div style="background-color:rgba(168, 85, 247, 0.05); padding:16px; border-radius:var(--radius-sm); text-align:center;">
                                <span style="font-size:20px; display:block; margin-bottom:6px;">👥</span>
                                <span style="font-size:11px; color:var(--text-muted);">현재 정원</span>
                                <strong style="display:block; font-size:14px; margin-top:4px;">${study.members.length} / ${study.maxMembers}명</strong>
                            </div>
                            <div style="background-color:rgba(16, 185, 129, 0.05); padding:16px; border-radius:var(--radius-sm); text-align:center;">
                                <span style="font-size:20px; display:block; margin-bottom:6px;">📅</span>
                                <span style="font-size:11px; color:var(--text-muted);">진행 일정</span>
                                <strong style="display:block; font-size:13px; margin-top:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${study.schedule}">${study.schedule}</strong>
                            </div>
                        </div>

                        <!-- Main description -->
                        <div class="detail-section">
                            <h3 class="detail-section-title">📝 스터디 소개 및 커리큘럼</h3>
                            <div class="detail-desc">${study.description}</div>
                        </div>
                    </div>

                    <!-- Right Column: Apply Panel & Members List -->
                    <div class="detail-sidebar">
                        <!-- Application Box -->
                        <div class="dashboard-panel glass-container" style="padding: 24px;">
                            <h3 class="detail-section-title" style="margin-bottom:16px;">🚪 스터디 참여하기</h3>
                            ${actionBtnHtml}
                        </div>

                        <!-- Members Panel -->
                        <div class="dashboard-panel glass-container" style="padding: 24px;">
                            <h3 class="detail-section-title" style="margin-bottom:8px;">👥 스터디원 (${memberProfiles.length}명)</h3>
                            <div class="member-list">
                                ${memberProfiles.map(m => {
                                    return `
                                        <div class="member-item">
                                            <div style="display:flex; align-items:center; gap:10px;">
                                                <div class="author-avatar">${m.nickname[0]}</div>
                                                <div style="display:flex; flex-direction:column;">
                                                    <span style="font-size:13px; font-weight:700;">${m.nickname}</span>
                                                    <span style="font-size:10px; color:var(--text-muted);">${m.dept}</span>
                                                </div>
                                            </div>
                                            ${m.isCreator ? `<span class="badge badge-primary" style="font-size:9px;">방장</span>` : ''}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.showPage('detail-page');
        },

        // Render Chat Room Page
        renderChat: function(study, messages, currentUser) {
            const container = document.getElementById('chat-page');

            // Render Study details sidebar inside the chat
            const memberProfiles = study.members.map(email => {
                const userObj = window.AppDB.getUserByEmail(email);
                return {
                    nickname: userObj ? userObj.nickname : email,
                    dept: userObj ? userObj.dept : '비공개 학과',
                    isCreator: email === study.creatorEmail
                };
            });

            container.innerHTML = `
                <div class="chat-layout glass-container">
                    
                    <!-- Chat Sidebar (Info & Members) -->
                    <div class="chat-sidebar">
                        <div class="chat-room-info">
                            <a href="#" id="back-to-dashboard-from-chat" style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 16px;">
                                &larr; 대시보드로 가기
                            </a>
                            <span class="badge badge-primary" style="margin-bottom: 8px;">${study.category}</span>
                            <h2 style="font-size: 16px; font-weight: 800; line-height: 1.4; color: var(--text-main);">${study.title}</h2>
                        </div>
                        
                        <div>
                            <h4 style="font-size: 12px; font-weight: 700; color: var(--text-muted); margin-bottom: 12px;">참여자 목록 (${memberProfiles.length}명)</h4>
                            <div style="display:flex; flex-direction:column; gap:10px; overflow-y:auto; max-height:220px;">
                                ${memberProfiles.map(m => `
                                    <div style="display:flex; align-items:center; gap:8px; padding:6px; border-radius:var(--radius-sm); background-color:white; border: 1px solid rgba(0,0,0,0.01)">
                                        <div class="author-avatar" style="width:24px; height:24px; font-size:10px;">${m.nickname[0]}</div>
                                        <div style="display:flex; flex-direction:column;">
                                            <span style="font-size:11px; font-weight:700;">${m.nickname}</span>
                                            <span style="font-size:9px; color:var(--text-muted);">${m.dept}</span>
                                        </div>
                                        ${m.isCreator ? `<span class="badge badge-primary" style="font-size:8px; padding: 2px 4px; margin-left:auto;">방장</span>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div style="margin-top:auto; padding-top:16px; border-top:1px solid #f1f5f9;">
                            <span style="font-size: 10px; color: var(--text-muted); display: block; margin-bottom: 4px;">📅 일정</span>
                            <span style="font-size: 12px; font-weight: 600;">${study.schedule}</span>
                        </div>
                    </div>

                    <!-- Chat Message Area -->
                    <div class="chat-area">
                        <!-- Chat Header -->
                        <div class="chat-header">
                            <div>
                                <h3 style="font-size: 15px; font-weight: 800;">💬 스터디 멤버 채팅방</h3>
                                <p style="font-size: 11px; color: var(--text-muted);">스터디 조원들과 첫 일정과 규칙을 의논해 보세요.</p>
                            </div>
                        </div>

                        <!-- Chat Messages List -->
                        <div class="chat-messages" id="chat-messages-container">
                            ${messages.length > 0 ? messages.map(msg => {
                                const isSelf = msg.senderEmail === currentUser.email;
                                const groupClass = isSelf ? 'self' : '';
                                
                                return `
                                    <div class="message-group ${groupClass}">
                                        <div class="msg-meta">
                                            <span class="msg-sender">${msg.senderNickname}</span>
                                            <div style="display: flex; gap: 4px; align-items: flex-end; justify-content: ${isSelf ? 'flex-end' : 'flex-start'}">
                                                <div class="msg-bubble">${msg.message}</div>
                                                <span class="msg-time">${new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('') : `
                                <div class="empty-state" style="margin: auto;">
                                    <span class="empty-state-icon">💬</span>
                                    <div class="empty-state-text">채팅방이 생성되었습니다.<br>조원들에게 인사글을 작성해 보세요.</div>
                                </div>
                            `}
                        </div>

                        <!-- Chat Input Box -->
                        <form id="chat-input-form" class="chat-input-area">
                            <input type="text" id="chat-msg-input" class="form-control" placeholder="메시지를 입력하세요..." required autocomplete="off">
                            <button type="submit" class="btn btn-primary" style="padding: 10px 20px;">전송</button>
                        </form>
                    </div>

                </div>
            `;
            this.showPage('chat-page');
            
            // Scroll to bottom of chat
            const chatContainer = document.getElementById('chat-messages-container');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        },

        // Helper to render Navigation bar updates dynamically
        updateNavbar: function(user) {
            const linksContainer = document.getElementById('nav-links-container');
            const profileContainer = document.getElementById('nav-profile-container');

            if (user) {
                // Logged In Links
                linksContainer.innerHTML = `
                    <div class="nav-link active" id="nav-dashboard">내 대시보드</div>
                    <div class="nav-link" id="nav-search">스터디 탐색</div>
                    <div class="nav-link" id="nav-interests">관심분야 변경</div>
                `;

                // Logged In Profile Card
                profileContainer.innerHTML = `
                    <div class="avatar">${user.nickname[0]}</div>
                    <div class="user-info-text">
                        <span class="user-name">${user.nickname}</span>
                        <span class="user-dept">${user.dept}</span>
                    </div>
                    <button class="btn btn-secondary btn-sm" id="logout-btn" style="margin-left: 12px; padding: 6px 12px;">로그아웃</button>
                `;
            } else {
                // Logged Out links
                linksContainer.innerHTML = `
                    <div class="nav-link active" id="nav-search-guest">스터디 탐색</div>
                `;

                // Logged Out Login buttons
                profileContainer.innerHTML = `
                    <button class="btn btn-secondary btn-sm" id="nav-login-btn">로그인</button>
                    <button class="btn btn-primary btn-sm" id="nav-signup-btn" style="margin-left: 8px;">회원가입</button>
                `;
            }
        }
    };

    window.AppViews = views;
})();
