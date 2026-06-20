// js/db.js
(function() {
    // Ensure localStorage keys exist, otherwise populate with dummy data.
    const STORAGE_KEYS = {
        USERS: 'study_platform_users',
        STUDIES: 'study_platform_studies',
        APPLICATIONS: 'study_platform_applications',
        NOTIFICATIONS: 'study_platform_notifications',
        CHATS: 'study_platform_chats',
        CURRENT_USER: 'study_platform_current_user'
    };

    // Prepopulated Initial Dummy Data
    const dummyUsers = [
        {
            email: 'kang@hanguk.ac.kr',
            password: 'password123!',
            nickname: '컴공러버',
            dept: '컴퓨터공학과',
            year: '23학번',
            interests: {
                categories: ['전공', '취업/코딩'],
                tags: ['컴퓨터공학', 'React', '알고리즘'],
                schedule: ['평일', '오후'],
                location: '대면'
            }
        },
        {
            email: 'lee@hanguk.ac.kr',
            password: 'password123!',
            nickname: '어학마스터',
            dept: '영어영문학과',
            year: '24학번',
            interests: {
                categories: ['어학'],
                tags: ['TOEIC', '영어회화'],
                schedule: ['주말', '오전'],
                location: '비대면'
            }
        },
        {
            email: 'kim@hanguk.ac.kr',
            password: 'password123!',
            nickname: '취준생김군',
            dept: '경영학과',
            year: '21학번',
            interests: {
                categories: ['취업/코딩', '자격증'],
                tags: ['금융3종', '경영학', 'SQLD'],
                schedule: ['평일', '오전'],
                location: '대면'
            }
        }
    ];

    const dummyStudies = [
        {
            id: 'study_1',
            title: '백준 알고리즘 실버~골드 격파 스터디 (주 2회)',
            category: '취업/코딩',
            minMembers: 3,
            maxMembers: 6,
            schedule: '매주 화, 목요일 오후 6시',
            type: '대면',
            description: '백준 실버 상위~골드 수준의 알고리즘 문제를 주 2회 모여서 함께 풉니다.\n참여 시 개인 깃허브 레포지토리에 커밋하여 코드 리뷰도 진행합니다. 성실하게 하실 분 환영합니다!',
            creatorEmail: 'kang@hanguk.ac.kr',
            creatorNickname: '컴공러버',
            status: '모집중',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            views: 42,
            members: ['kang@hanguk.ac.kr']
        },
        {
            id: 'study_2',
            title: '토익 850+ 목표 매일 RC/LC 인증 및 주말 스터디',
            category: '어학',
            minMembers: 4,
            maxMembers: 8,
            schedule: '매주 토요일 오전 10시',
            type: '비대면',
            description: '토익 고득점(850점 이상)을 위한 문제집 풀이 스터디입니다.\n평일에는 매일 RC/LC 한 회씩 풀어서 단톡에 인증하고, 주말에는 오답노트 정리와 어려운 문항에 대한 의견을 나눕니다.',
            creatorEmail: 'lee@hanguk.ac.kr',
            creatorNickname: '어학마스터',
            status: '모집중',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            views: 28,
            members: ['lee@hanguk.ac.kr']
        },
        {
            id: 'study_3',
            title: 'SQLD 및 ADsP 자격증 취득 벼락치기 반',
            category: '자격증',
            minMembers: 2,
            maxMembers: 4,
            schedule: '매주 월, 수요일 오전 10시',
            type: '대면',
            description: '경영학과 및 비전공자 대상 데이터 분석 자격증 동시 대비반입니다.\n요약 노트 요점 정리 후 기출문제를 반복 풀이합니다. 다 같이 합격합시다!',
            creatorEmail: 'kim@hanguk.ac.kr',
            creatorNickname: '취준생김군',
            status: '모집중',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            views: 19,
            members: ['kim@hanguk.ac.kr']
        }
    ];

    const dummyChats = {
        'study_1': [
            {
                id: 'msg_1',
                senderEmail: 'kang@hanguk.ac.kr',
                senderNickname: '컴공러버',
                message: '안녕하세요! 스터디를 개설한 방장 컴공러버입니다. 승인되신 분들 환영해요!',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]
    };

    // Helper to get from LocalStorage
    function get(key, defaultValue) {
        const val = localStorage.getItem(key);
        if (!val) {
            localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue;
        }
        return JSON.parse(val);
    }

    // Helper to save to LocalStorage
    function save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Mock DB interface
    const db = {
        // Users
        getUsers: () => get(STORAGE_KEYS.USERS, dummyUsers),
        saveUser: (user) => {
            const users = db.getUsers();
            users.push(user);
            save(STORAGE_KEYS.USERS, users);
        },
        updateUser: (updatedUser) => {
            const users = db.getUsers();
            const index = users.findIndex(u => u.email === updatedUser.email);
            if (index !== -1) {
                users[index] = updatedUser;
                save(STORAGE_KEYS.USERS, users);
            }
        },
        getUserByEmail: (email) => {
            return db.getUsers().find(u => u.email === email);
        },

        // Auth Session
        getCurrentUser: () => {
            const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            return user ? JSON.parse(user) : null;
        },
        setCurrentUser: (user) => {
            if (user) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
            } else {
                localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            }
        },

        // Studies
        getStudies: () => get(STORAGE_KEYS.STUDIES, dummyStudies),
        saveStudy: (study) => {
            const studies = db.getStudies();
            studies.push(study);
            save(STORAGE_KEYS.STUDIES, studies);
        },
        updateStudy: (updatedStudy) => {
            const studies = db.getStudies();
            const index = studies.findIndex(s => s.id === updatedStudy.id);
            if (index !== -1) {
                studies[index] = updatedStudy;
                save(STORAGE_KEYS.STUDIES, studies);
            }
        },
        getStudyById: (id) => {
            return db.getStudies().find(s => s.id === id);
        },

        // Applications
        getApplications: () => get(STORAGE_KEYS.APPLICATIONS, []),
        saveApplication: (app) => {
            const apps = db.getApplications();
            apps.push(app);
            save(STORAGE_KEYS.APPLICATIONS, apps);
        },
        updateApplicationStatus: (appId, status) => {
            const apps = db.getApplications();
            const app = apps.find(a => a.id === appId);
            if (app) {
                app.status = status;
                save(STORAGE_KEYS.APPLICATIONS, apps);

                // If approved, add applicant to study members
                if (status === '승인 완료') {
                    const study = db.getStudyById(app.studyId);
                    if (study && !study.members.includes(app.applicantEmail)) {
                        study.members.push(app.applicantEmail);
                        db.updateStudy(study);
                    }
                }
            }
        },

        // Notifications
        getNotifications: () => get(STORAGE_KEYS.NOTIFICATIONS, []),
        saveNotification: (noti) => {
            const notis = db.getNotifications();
            notis.push(noti);
            save(STORAGE_KEYS.NOTIFICATIONS, notis);
        },
        getUserNotifications: (email) => {
            return db.getNotifications().filter(n => n.toEmail === email).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        },
        markNotificationAsRead: (notiId) => {
            const notis = db.getNotifications();
            const noti = notis.find(n => n.id === notiId);
            if (noti) {
                noti.read = true;
                save(STORAGE_KEYS.NOTIFICATIONS, notis);
            }
        },

        // Chats
        getChats: () => get(STORAGE_KEYS.CHATS, dummyChats),
        getStudyChats: (studyId) => {
            const chats = db.getChats();
            return chats[studyId] || [];
        },
        saveChatMessage: (studyId, msg) => {
            const chats = db.getChats();
            if (!chats[studyId]) {
                chats[studyId] = [];
            }
            chats[studyId].push(msg);
            save(STORAGE_KEYS.CHATS, chats);
        }
    };

    // Initialize data in localStorage
    db.getUsers();
    db.getStudies();
    db.getChats();

    window.AppDB = db;
})();
