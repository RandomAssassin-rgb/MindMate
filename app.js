// MindMate App - Main JavaScript with Supabase Integration
const APP_STATE = {
    currentPage: 'home',
    user: null,
    session: null,
    profile: null,
    moodLogs: [],
    phq9Answers: [],
    gad7Answers: [],
    chatMessages: [],
    points: 0,
    streak: 0,
    badges: []
};

// PHQ-9 Questions
const PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure",
    "Trouble concentrating on things",
    "Moving or speaking slowly, or being fidgety/restless",
    "Thoughts that you would be better off dead, or of hurting yourself"
];

// GAD-7 Questions
const GAD7_QUESTIONS = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid, as if something awful might happen"
];

const ANSWER_OPTIONS = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" }
];

// Wait for Supabase to load
function waitForSupabase() {
    return new Promise((resolve) => {
        if (window.MindMateConfig?.supabase) {
            resolve(window.MindMateConfig.supabase);
        } else {
            const check = setInterval(() => {
                if (window.MindMateConfig?.supabase) {
                    clearInterval(check);
                    resolve(window.MindMateConfig.supabase);
                }
            }, 100);
        }
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initHeader();
    initCrisisBanner();
    initModals();
    initMoodTracker();
    initAssessments();
    initChat();
    initVideoConsult();
    initCBT();
    initSafetyPlan();
    initRelax();
    initLearn();

    // Initialize Supabase auth
    await initAuth();
});

// Authentication
async function initAuth() {
    try {
        const supabase = await waitForSupabase();

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            await handleAuthChange(session);
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event);
            if (session) {
                await handleAuthChange(session);
            } else {
                handleLogout();
            }
        });
    } catch (error) {
        console.log('Supabase not configured, using demo mode');
        loadMockData();
    }
}

async function handleAuthChange(session) {
    APP_STATE.session = session;
    APP_STATE.user = session.user;

    // Fetch user profile
    await fetchUserProfile();
    await fetchUserData();

    updateAuthUI(true);
    showToast(`Welcome, ${APP_STATE.profile?.full_name || APP_STATE.user.email}!`, 'success');
}

function handleLogout() {
    APP_STATE.session = null;
    APP_STATE.user = null;
    APP_STATE.profile = null;
    APP_STATE.moodLogs = [];
    APP_STATE.badges = [];
    APP_STATE.points = 0;
    APP_STATE.streak = 0;

    updateAuthUI(false);
}

async function fetchUserProfile() {
    if (!APP_STATE.user) return;

    const supabase = window.MindMateConfig?.supabase;
    if (!supabase) return;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', APP_STATE.user.id)
        .single();

    if (!error && data) {
        APP_STATE.profile = data;
        APP_STATE.points = data.points || 0;
        APP_STATE.streak = data.streak || 0;
        updateGamificationStats();
    }
}

async function fetchUserData() {
    if (!APP_STATE.user) return;

    const supabase = window.MindMateConfig?.supabase;
    if (!supabase) return;

    // Fetch mood logs
    const { data: moods } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', APP_STATE.user.id)
        .order('logged_at', { ascending: false })
        .limit(30);

    if (moods) {
        APP_STATE.moodLogs = moods.map(m => ({
            id: m.id,
            mood: m.mood_score,
            note: m.note,
            date: m.logged_at,
            emoji: getEmojiForMood(m.mood_score)
        }));
        updateMoodHistory();
        updateMoodChart();
    }

    // Fetch badges
    const { data: badges } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', APP_STATE.user.id);

    if (badges) {
        APP_STATE.badges = badges.map(b => b.badge_name);
        updateBadgesDisplay();
    }
}

function updateAuthUI(isLoggedIn) {
    const signInBtn = document.querySelector('[data-modal="auth"]');
    if (signInBtn) {
        if (isLoggedIn) {
            signInBtn.textContent = 'My Profile';
            signInBtn.removeAttribute('data-modal');
            signInBtn.setAttribute('data-page', 'profile');
        } else {
            signInBtn.textContent = 'Sign In';
            signInBtn.setAttribute('data-modal', 'auth');
            signInBtn.removeAttribute('data-page');
        }
    }

    // Update profile page if visible
    if (isLoggedIn && APP_STATE.profile) {
        const profileName = document.querySelector('.profile-info h2');
        const profileEmail = document.querySelector('.profile-info p');
        const profileAvatar = document.querySelector('.profile-avatar');

        if (profileName) profileName.textContent = APP_STATE.profile.full_name || 'User';
        if (profileEmail) profileEmail.textContent = APP_STATE.user.email;
        if (profileAvatar) profileAvatar.textContent = (APP_STATE.profile.full_name || APP_STATE.user.email)[0].toUpperCase();
    }
}

// Navigation
function initNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => {
            const page = card.dataset.page;
            if (page) navigateTo(page);
        });
    });
}

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const page = document.getElementById(`page-${pageId}`);
    if (page) {
        page.classList.add('active');
        APP_STATE.currentPage = pageId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));
    closeMobileMenu();
}

// Header scroll effect
function initHeader() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-mobile');
    toggle?.addEventListener('click', () => nav?.classList.toggle('open'));
}

function closeMobileMenu() {
    document.querySelector('.nav-mobile')?.classList.remove('open');
}

// Crisis Banner
function initCrisisBanner() {
    const banner = document.querySelector('.crisis-banner');
    const closeBtn = banner?.querySelector('.crisis-close');
    closeBtn?.addEventListener('click', () => banner.classList.add('hidden'));
}

// Modals
function initModals() {
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', () => openModal(trigger.dataset.modal));
    });

    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
        el.addEventListener('click', closeAllModals);
    });

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`form-${tab.dataset.tab}`)?.classList.add('active');
        });
    });

    // Auth forms
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);

    // Google auth
    document.querySelectorAll('.btn-google').forEach(btn => {
        btn.addEventListener('click', handleGoogleAuth);
    });
}

function openModal(modalId) {
    document.getElementById(`modal-${modalId}`)?.classList.add('open');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
}

// Auth Handlers
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const supabase = window.MindMateConfig?.supabase;
    if (!supabase) {
        APP_STATE.user = { email };
        closeAllModals();
        showToast('Demo mode: Welcome back!', 'success');
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        showToast(error.message, 'error');
    } else {
        closeAllModals();
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const supabase = window.MindMateConfig?.supabase;
    if (!supabase) {
        APP_STATE.user = { email };
        closeAllModals();
        showToast('Demo mode: Account created!', 'success');
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: name }
        }
    });

    if (error) {
        showToast(error.message, 'error');
    } else {
        showToast('Check your email to confirm your account!', 'success');
        closeAllModals();
    }
}

async function handleGoogleAuth() {
    let supabase = window.MindMateConfig?.supabase;

    // Call waitForSupabase if client isn't ready
    if (!supabase) {
        showToast('Connecting to secure service...', 'info');
        try {
            supabase = await waitForSupabase();
        } catch (e) {
            console.error('Supabase wait failed', e);
        }
    }

    console.log('=== Google Auth Debug ===');
    console.log('Supabase client:', supabase ? 'Available' : 'NOT FOUND');
    console.log('Current origin:', window.location.origin);

    if (!supabase) {
        showToast('Connection failed. Try refreshing the page.', 'error');
        return;
    }

    try {
        closeAllModals();
        showToast('Redirecting to Google...', 'info');

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
                skipBrowserRedirect: false
            }
        });

        console.log('OAuth response:', { data, error });

        if (error) {
            console.error('Google auth error:', error);
            showToast('Google sign-in failed: ' + error.message, 'error');
        } else if (data?.url) {
            console.log('OAuth URL:', data.url);
            // Fallback: manually redirect if auto-redirect didn't work
            window.location.href = data.url;
        }
    } catch (error) {
        console.error('Google auth exception:', error);
        showToast('Error: ' + error.message, 'error');
    }
}

// Mood Tracker
function initMoodTracker() {
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    document.getElementById('saveMoodBtn')?.addEventListener('click', saveMood);
}

async function saveMood() {
    const selectedMood = document.querySelector('.mood-btn.selected');
    if (!selectedMood) {
        showToast('Please select a mood first', 'warning');
        return;
    }

    const mood = parseInt(selectedMood.dataset.mood);
    const note = document.getElementById('moodNote')?.value || '';

    // If logged in, save to Supabase
    if (APP_STATE.user && window.MindMateConfig?.supabase) {
        try {
            const response = await fetch(window.MindMateConfig.EDGE_FUNCTIONS.logMood, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${APP_STATE.session.access_token}`
                },
                body: JSON.stringify({
                    mood_score: mood,
                    note,
                    user_id: APP_STATE.user.id
                })
            });

            const result = await response.json();
            if (result.success) {
                APP_STATE.points += 5;
                APP_STATE.streak = result.new_streak || APP_STATE.streak + 1;

                if (result.new_badge) {
                    showToast(`🏆 Badge earned: ${result.new_badge}!`, 'success');
                }
            }
        } catch (error) {
            console.error('Error saving mood:', error);
        }
    }

    // Update local state
    const log = {
        id: Date.now(),
        mood,
        note,
        date: new Date().toISOString(),
        emoji: getEmojiForMood(mood)
    };

    APP_STATE.moodLogs.unshift(log);

    updateMoodHistory();
    updateMoodChart();
    updateGamificationStats();

    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('moodNote').value = '';

    showToast('Mood logged! +5 points', 'success');
}

function getEmojiForMood(mood) {
    const emojis = { 1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😄' };
    return emojis[mood] || '😐';
}

function updateMoodHistory() {
    const list = document.getElementById('moodHistoryList');
    if (!list) return;

    if (APP_STATE.moodLogs.length === 0) {
        list.innerHTML = '<p class="history-placeholder">No moods logged yet. Start tracking today!</p>';
        return;
    }

    list.innerHTML = APP_STATE.moodLogs.slice(0, 10).map(log => `
    <div class="history-item">
      <span class="history-emoji">${log.emoji}</span>
      <div>
        <span class="history-date">${new Date(log.date).toLocaleDateString()}</span>
        ${log.note ? `<p class="history-note">${log.note}</p>` : ''}
      </div>
    </div>
  `).join('');
}

function updateMoodChart() {
    const ctx = document.getElementById('moodChart')?.getContext('2d');
    if (!ctx || APP_STATE.moodLogs.length === 0) return;

    const last7 = APP_STATE.moodLogs.slice(0, 7).reverse();
    const labels = last7.map(l => new Date(l.date).toLocaleDateString('en', { weekday: 'short' }));
    const data = last7.map(l => l.mood);

    if (window.moodChartInstance) window.moodChartInstance.destroy();

    window.moodChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Mood',
                data,
                borderColor: '#124999',
                backgroundColor: 'rgba(18, 73, 153, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#124999',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 1, max: 5, ticks: { stepSize: 1 } },
                x: { grid: { display: false } }
            }
        }
    });
}

function updateGamificationStats() {
    const pointsEl = document.getElementById('userPoints');
    const streakEl = document.getElementById('userStreak');
    const profilePoints = document.getElementById('profilePoints');
    const profileStreak = document.getElementById('profileStreak');

    if (pointsEl) pointsEl.textContent = APP_STATE.points;
    if (streakEl) streakEl.textContent = APP_STATE.streak;
    if (profilePoints) profilePoints.textContent = APP_STATE.points;
    if (profileStreak) profileStreak.textContent = APP_STATE.streak;
}

function updateBadgesDisplay() {
    const badgesList = document.querySelector('.badges-list');
    if (!badgesList) return;

    if (APP_STATE.badges.length === 0) {
        badgesList.innerHTML = '<p class="badge-placeholder">Complete activities to earn badges!</p>';
    } else {
        badgesList.innerHTML = APP_STATE.badges.map(badge =>
            `<span class="badge-tag">${badge}</span>`
        ).join('');
    }
}

// Assessments
function initAssessments() {
    initPHQ9();
    initGAD7();
}

function initPHQ9() {
    APP_STATE.phq9Answers = new Array(9).fill(null);
    APP_STATE.phq9CurrentQ = 0;
    renderPHQ9Question();

    document.getElementById('phq9PrevBtn')?.addEventListener('click', () => phq9Navigate(-1));
    document.getElementById('phq9NextBtn')?.addEventListener('click', () => phq9Navigate(1));
}

function renderPHQ9Question() {
    const container = document.getElementById('phq9Questions');
    if (!container) return;

    const q = APP_STATE.phq9CurrentQ;
    const progress = ((q + 1) / 9) * 100;

    document.getElementById('phq9Progress').style.width = `${progress}%`;
    document.getElementById('phq9ProgressText').textContent = `${q + 1} of 9`;

    container.innerHTML = `
    <div class="question-slide active">
      <p class="question-text">${q + 1}. ${PHQ9_QUESTIONS[q]}</p>
      <div class="answer-options">
        ${ANSWER_OPTIONS.map(opt => `
          <label class="answer-option ${APP_STATE.phq9Answers[q] === opt.value ? 'selected' : ''}">
            <input type="radio" name="phq9-q${q}" value="${opt.value}" ${APP_STATE.phq9Answers[q] === opt.value ? 'checked' : ''}>
            <span class="answer-radio"></span>
            <span>${opt.label}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;

    container.querySelectorAll('.answer-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const val = parseInt(opt.querySelector('input').value);
            APP_STATE.phq9Answers[q] = val;
            container.querySelectorAll('.answer-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });

    document.getElementById('phq9PrevBtn').style.visibility = q === 0 ? 'hidden' : 'visible';
    document.getElementById('phq9NextBtn').textContent = q === 8 ? 'See Results' : 'Next Question →';
}

function phq9Navigate(dir) {
    const q = APP_STATE.phq9CurrentQ;

    if (dir === 1 && APP_STATE.phq9Answers[q] === null) {
        showToast('Please select an answer', 'warning');
        return;
    }

    if (dir === 1 && q === 8) {
        submitPHQ9();
        return;
    }

    APP_STATE.phq9CurrentQ = Math.max(0, Math.min(8, q + dir));
    renderPHQ9Question();
}

async function submitPHQ9() {
    const score = APP_STATE.phq9Answers.reduce((a, b) => a + b, 0);
    let result;

    // Try to submit to Edge Function if logged in
    if (APP_STATE.user && window.MindMateConfig?.EDGE_FUNCTIONS) {
        try {
            const response = await fetch(window.MindMateConfig.EDGE_FUNCTIONS.phq9Score, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${APP_STATE.session.access_token}`
                },
                body: JSON.stringify({
                    answers: APP_STATE.phq9Answers,
                    user_id: APP_STATE.user.id
                })
            });
            result = await response.json();
            APP_STATE.points += 20;
            updateGamificationStats();
        } catch (error) {
            console.error('Error submitting PHQ9:', error);
        }
    }

    // Fallback local scoring
    if (!result) {
        let severity, desc;
        if (score <= 4) { severity = 'None'; desc = 'Minimal symptoms. Keep monitoring your well-being.'; }
        else if (score <= 9) { severity = 'Mild'; desc = 'Mild symptoms. Self-care strategies may help.'; }
        else if (score <= 14) { severity = 'Moderate'; desc = 'Consider speaking with a counselor.'; }
        else if (score <= 19) { severity = 'Moderately Severe'; desc = 'Professional support is recommended.'; }
        else { severity = 'Severe'; desc = 'Please seek professional help soon.'; }
        result = { score, severity, description: desc };
    }

    showPHQ9Results(result);
}

function showPHQ9Results(result) {
    document.getElementById('phq9Form').style.display = 'none';
    const results = document.getElementById('phq9Results');
    results.style.display = 'block';

    const severityClass = result.severity.toLowerCase().replace(' ', '-');

    results.innerHTML = `
    <div class="result-card">
      <div class="result-score">
        <span class="score-number">${result.score}</span>
        <span class="score-label">/ 27</span>
      </div>
      <div class="result-severity ${severityClass}">${result.severity} Depression</div>
      <p class="result-description">${result.description}</p>
      <div class="result-actions">
        <button class="btn btn-primary" onclick="location.reload()">Take Again</button>
        <button class="btn btn-secondary" onclick="navigateTo('chat')">Talk to AI Counselor</button>
      </div>
    </div>
  `;

    showToast('Assessment complete! +20 points', 'success');
}

function initGAD7() {
    APP_STATE.gad7Answers = new Array(7).fill(null);
    APP_STATE.gad7CurrentQ = 0;
    renderGAD7Question();

    document.getElementById('gad7PrevBtn')?.addEventListener('click', () => gad7Navigate(-1));
    document.getElementById('gad7NextBtn')?.addEventListener('click', () => gad7Navigate(1));
}

function renderGAD7Question() {
    const container = document.getElementById('gad7Questions');
    if (!container) return;

    const q = APP_STATE.gad7CurrentQ;
    const progress = ((q + 1) / 7) * 100;

    document.getElementById('gad7Progress').style.width = `${progress}%`;
    document.getElementById('gad7ProgressText').textContent = `${q + 1} of 7`;

    container.innerHTML = `
    <div class="question-slide active">
      <p class="question-text">${q + 1}. ${GAD7_QUESTIONS[q]}</p>
      <div class="answer-options">
        ${ANSWER_OPTIONS.map(opt => `
          <label class="answer-option ${APP_STATE.gad7Answers[q] === opt.value ? 'selected' : ''}">
            <input type="radio" name="gad7-q${q}" value="${opt.value}" ${APP_STATE.gad7Answers[q] === opt.value ? 'checked' : ''}>
            <span class="answer-radio"></span>
            <span>${opt.label}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;

    container.querySelectorAll('.answer-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const val = parseInt(opt.querySelector('input').value);
            APP_STATE.gad7Answers[q] = val;
            container.querySelectorAll('.answer-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });

    document.getElementById('gad7PrevBtn').style.visibility = q === 0 ? 'hidden' : 'visible';
    document.getElementById('gad7NextBtn').textContent = q === 6 ? 'See Results' : 'Next Question →';
}

function gad7Navigate(dir) {
    const q = APP_STATE.gad7CurrentQ;

    if (dir === 1 && APP_STATE.gad7Answers[q] === null) {
        showToast('Please select an answer', 'warning');
        return;
    }

    if (dir === 1 && q === 6) {
        submitGAD7();
        return;
    }

    APP_STATE.gad7CurrentQ = Math.max(0, Math.min(6, q + dir));
    renderGAD7Question();
}

async function submitGAD7() {
    const score = APP_STATE.gad7Answers.reduce((a, b) => a + b, 0);
    let result;

    if (APP_STATE.user && window.MindMateConfig?.EDGE_FUNCTIONS) {
        try {
            const response = await fetch(window.MindMateConfig.EDGE_FUNCTIONS.gad7Score, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${APP_STATE.session.access_token}`
                },
                body: JSON.stringify({
                    answers: APP_STATE.gad7Answers,
                    user_id: APP_STATE.user.id
                })
            });
            result = await response.json();
            APP_STATE.points += 20;
            updateGamificationStats();
        } catch (error) {
            console.error('Error submitting GAD7:', error);
        }
    }

    if (!result) {
        let severity, desc;
        if (score <= 4) { severity = 'Minimal'; desc = 'Low anxiety. Continue healthy habits.'; }
        else if (score <= 9) { severity = 'Mild'; desc = 'Mild anxiety. Relaxation techniques may help.'; }
        else if (score <= 14) { severity = 'Moderate'; desc = 'Consider speaking with a counselor.'; }
        else { severity = 'Severe'; desc = 'Professional support is recommended.'; }
        result = { score, severity, description: desc };
    }

    showGAD7Results(result);
}

function showGAD7Results(result) {
    document.getElementById('gad7Form').style.display = 'none';
    const results = document.getElementById('gad7Results');
    results.style.display = 'block';

    results.innerHTML = `
    <div class="result-card">
      <div class="result-score">
        <span class="score-number">${result.score}</span>
        <span class="score-label">/ 21</span>
      </div>
      <div class="result-severity ${result.severity.toLowerCase()}">${result.severity} Anxiety</div>
      <p class="result-description">${result.description}</p>
      <div class="result-actions">
        <button class="btn btn-primary" onclick="location.reload()">Take Again</button>
        <button class="btn btn-secondary" onclick="navigateTo('chat')">Talk to AI Counselor</button>
      </div>
    </div>
  `;

    showToast('Assessment complete! +20 points', 'success');
}

// AI Chat
function initChat() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');

    sendBtn?.addEventListener('click', sendMessage);
    input?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('chatInput').value = btn.textContent;
            sendMessage();
        });
    });
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    addChatMessage('user', message);
    input.value = '';

    showTypingIndicator();

    let response;

    // Try Edge Function if available
    if (window.MindMateConfig?.EDGE_FUNCTIONS) {
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (APP_STATE.session?.access_token) {
                headers['Authorization'] = `Bearer ${APP_STATE.session.access_token}`;
            }

            const res = await fetch(window.MindMateConfig.EDGE_FUNCTIONS.chat, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    message,
                    user_id: APP_STATE.user?.id
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error: ${res.status}`);
            }

            const data = await res.json();
            response = data.response;
        } catch (error) {
            console.error('Chat API error:', error);
            showToast(`Remote AI Error: ${error.message}`, 'error');
        }
    } else {
        console.warn("Config missing", window.MindMateConfig);
        showToast("Configuration loading...", "warning");
    }

    // Fallback to local responses
    if (!response) {
        response = generateLocalAIResponse(message);
    }

    hideTypingIndicator();
    addChatMessage('bot', response);
}

function addChatMessage(sender, text) {
    const container = document.getElementById('chatMessages');
    const welcome = container.querySelector('.chat-welcome');
    if (welcome) welcome.style.display = 'none';

    const time = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
    const avatar = sender === 'bot' ? '🧠' : '👤';

    const msg = document.createElement('div');
    msg.className = `message ${sender}`;

    let contentHtml = text;
    if (sender === 'bot' && typeof marked !== 'undefined') {
        contentHtml = marked.parse(text);
    } else {
        contentHtml = `<p class="message-text">${text}</p>`;
    }

    msg.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="markdown-body">${contentHtml}</div>
      <span class="message-time">${time}</span>
    </div>
  `;

    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const typing = document.createElement('div');
    typing.className = 'message bot typing';
    typing.id = 'typingIndicator';
    typing.innerHTML = `
    <div class="message-avatar">🧠</div>
    <div class="message-content">
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator')?.remove();
}

function generateLocalAIResponse(message) {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('stress') || lowerMsg.includes('overwhelm')) {
        return "I understand you're feeling stressed. Let's work through this together. Try taking 3 deep breaths right now - inhale for 4 seconds, hold for 4, exhale for 6. Would you like me to guide you through a longer relaxation exercise?";
    }
    if (lowerMsg.includes('anxiety') || lowerMsg.includes('anxious') || lowerMsg.includes('worried')) {
        return "Anxiety can feel overwhelming. Let's try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, and 1 you taste. This can help bring you back to the present moment.";
    }
    if (lowerMsg.includes('sad') || lowerMsg.includes('depressed') || lowerMsg.includes('down')) {
        return "I'm sorry you're feeling this way. Your feelings are valid, and it takes courage to talk about them. Would you like to share more about what's been happening? Remember, if you're having thoughts of self-harm, please reach out to the crisis helpline (988) immediately.";
    }
    if (lowerMsg.includes('sleep') || lowerMsg.includes('insomnia') || lowerMsg.includes('tired')) {
        return "Sleep issues can really affect your well-being. Some tips: maintain a consistent schedule, avoid screens an hour before bed, and create a calming bedtime routine. Would you like more specific suggestions?";
    }
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        return "Hello! I'm here to support your mental wellness journey. How are you feeling today? You can share anything on your mind, or try one of our assessments to better understand your emotional health.";
    }

    return "Thank you for sharing that with me. I'm here to support you. Would you like to explore some coping strategies, or would you prefer to tell me more about what you're experiencing? Remember, you're not alone in this.";
}

// Video Consult
function initVideoConsult() {
    document.getElementById('startVideoBtn')?.addEventListener('click', startVideoCall);
}

async function startVideoCall() {
    const container = document.getElementById('jitsiContainer');
    const placeholder = document.querySelector('.video-placeholder');

    if (placeholder) placeholder.style.display = 'none';
    if (container) container.style.display = 'block';

    const roomName = 'MindMate-' + Math.random().toString(36).substring(2, 10);
    let currentCallId = null;

    // Log call start to DB
    if (APP_STATE.user && window.MindMateConfig?.EDGE_FUNCTIONS?.logVideoCall) {
        try {
            const res = await fetch(window.MindMateConfig.EDGE_FUNCTIONS.logVideoCall, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${APP_STATE.session?.access_token || ''}`
                },
                body: JSON.stringify({
                    action: 'start',
                    user_id: APP_STATE.user.id,
                    room_name: roomName
                })
            });
            const data = await res.json();
            if (data.success) {
                currentCallId = data.call.id;
                console.log('Call started, ID:', currentCallId);
            }
        } catch (error) {
            console.error('Error logging call start:', error);
        }
    }

    if (typeof JitsiMeetExternalAPI !== 'undefined') {
        // clean up previous instance if any
        container.innerHTML = '';

        const api = new JitsiMeetExternalAPI('meet.jit.si', {
            roomName,
            parentNode: container,
            width: '100%',
            height: 500,
            configOverwrite: {
                startWithVideoMuted: false,
                startWithAudioMuted: false,
                prejoinPageEnabled: false
            },
            userInfo: {
                displayName: APP_STATE.profile?.full_name || 'MindMate User'
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup', 'chat', 'fullscreen']
            }
        });

        // Handle call end
        const handleCallEnd = async () => {
            console.log('Call ending...');
            container.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';

            // Log call end to DB
            if (currentCallId && window.MindMateConfig?.EDGE_FUNCTIONS?.logVideoCall) {
                try {
                    const res = await fetch(window.MindMateConfig.EDGE_FUNCTIONS.logVideoCall, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${APP_STATE.session?.access_token || ''}`
                        },
                        body: JSON.stringify({
                            action: 'end',
                            call_id: currentCallId,
                            user_id: APP_STATE.user.id
                        })
                    });
                    const data = await res.json();
                    if (data.points_awarded > 0) {
                        showToast(`Call complete! +${data.points_awarded} points`, 'success');
                        APP_STATE.points += data.points_awarded;
                        updateGamificationStats();
                    } else {
                        showToast('Call ended.', 'info');
                    }
                } catch (error) {
                    console.error('Error logging call end:', error);
                }
            }

            api.dispose();
        };

        api.addEventListener('videoConferenceLeft', handleCallEnd);
        api.addEventListener('readyToClose', handleCallEnd);

        showToast('Video call started! Connecting...', 'success');
    } else {
        showToast('Video service is loading, please try again.', 'warning');
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// CBT Journaling Logic
function initCBT() {
    const form = document.getElementById('cbtForm');
    if (!form) return;

    const steps = form.querySelectorAll('.cbt-step');
    const indicators = document.querySelectorAll('.step-indicators .step');
    let currentStep = 1;

    // Navigation
    form.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDiv = form.querySelector(`.cbt-step[data-step="${currentStep}"]`);
            const inputs = currentDiv.querySelectorAll('input, textarea, select');
            let valid = true;
            inputs.forEach(i => { if (!i.checkValidity()) valid = false; i.reportValidity(); });
            if (!valid) return;

            currentStep++;
            updateStep();
        });
    });

    form.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            updateStep();
        });
    });

    function updateStep() {
        steps.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));

        form.querySelector(`.cbt-step[data-step="${currentStep}"]`).classList.add('active');
        // indicators are 0-indexed in array, steps 1-indexed
        if (indicators[currentStep - 1]) indicators[currentStep - 1].classList.add('active');
    }

    // Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const supabase = window.MindMateConfig.supabase;

        // Basic check for demo vs real
        if (APP_STATE.user && supabase) {
            try {
                const { error } = await supabase.from('cbt_entries').insert({
                    user_id: APP_STATE.user.id,
                    trigger: data.trigger,
                    emotion: data.emotion,
                    intensity: parseInt(data.intensity),
                    automatic_thought: data.automatic_thought,
                    distortion: data.distortion,
                    challenge: data.challenge,
                    balanced_thought: data.balanced_thought
                });

                if (!error) {
                    showToast('Thought Record saved! +25 points', 'success');
                    APP_STATE.points = (APP_STATE.points || 0) + 25;
                    updateGamificationStats();

                    // Award badge if first time? (Optional)

                    closeAllModals();
                    form.reset();
                    currentStep = 1;
                    updateStep();
                } else {
                    console.error('CBT Save Error:', error);
                    showToast('Error saving entry.', 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('Error connecting to database.', 'error');
            }
        } else {
            showToast('Demo saved! (Login to persist)', 'success');
            closeAllModals();
            form.reset();
            currentStep = 1;
            updateStep();
        }
    });
}

// Safety Plan Logic
async function initSafetyPlan() {
    const form = document.getElementById('safetyForm');
    if (!form) return;

    // Load existing plan if user is logged in
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
            const { data, error } = await supabase
                .from('safety_plans')
                .select('*')
                .eq('user_id', session.user.id)
                .single();

            if (data) {
                form.querySelector('[name="warning_signs"]').value = data.warning_signs || '';
                form.querySelector('[name="coping_strategies"]').value = data.coping_strategies || '';
                form.querySelector('[name="trusted_contact_name"]').value = data.trusted_contact_name || '';
                form.querySelector('[name="trusted_contact_phone"]').value = data.trusted_contact_phone || '';
                form.querySelector('[name="professional_contact_name"]').value = data.professional_contact_name || '';
                form.querySelector('[name="professional_contact_phone"]').value = data.professional_contact_phone || '';
                form.querySelector('[name="safe_places"]').value = data.safe_places || '';
            }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updates = Object.fromEntries(formData.entries());

        if (APP_STATE.user) {
            // Check if exists to determine update or insert (or let upsert handle it if we had ID, but we don't store plan ID in state yet)
            // Simpler: select to get ID then update, or just upsert on user_id if unique constraint existed (it doesn't by default).
            // Let's do check-then-upsert logic manually or assume single row per user policy.

            const { data: existing } = await supabase.from('safety_plans').select('id').eq('user_id', APP_STATE.user.id).single();

            let error;
            if (existing) {
                const { error: err } = await supabase.from('safety_plans').update(updates).eq('id', existing.id);
                error = err;
            } else {
                updates.user_id = APP_STATE.user.id;
                const { error: err } = await supabase.from('safety_plans').insert(updates);
                error = err;
            }

            if (!error) {
                showToast('Safety Plan updated.', 'success');
                closeAllModals();
            } else {
                console.error('Safety Save Error:', error);
                showToast('Error saving plan.', 'error');
            }
        } else {
            showToast('Demo plan saved locally.', 'success');
            closeAllModals();
        }
    });
}

// Load mock data for demo mode
function loadMockData() {
    APP_STATE.points = 45;
    APP_STATE.streak = 3;
    APP_STATE.moodLogs = [
        { id: 1, mood: 4, note: 'Had a good day at class', date: new Date(Date.now() - 86400000).toISOString(), emoji: '🙂' },
        { id: 2, mood: 3, note: '', date: new Date(Date.now() - 172800000).toISOString(), emoji: '😐' },
        { id: 3, mood: 4, note: 'Exercised today', date: new Date(Date.now() - 259200000).toISOString(), emoji: '🙂' }
    ];

    updateMoodHistory();
    updateMoodChart();
    updateGamificationStats();
}

// --- Relax Page Logic ---
let audioPlayerState = { currentTrackId: null, isPlaying: false };
let breathingInterval = null;

async function initRelax() {
    const containers = {
        'Sleep': document.getElementById('scroll-Sleep'),
        'Meditation': document.getElementById('scroll-Meditation'),
        'Sounds': document.getElementById('scroll-Sounds'),
        'Focus': document.getElementById('scroll-Focus')
    };

    if (!document.getElementById('page-relax')) return;

    // Ensure Supabase is ready
    let supabase = window.MindMateConfig?.supabase;
    if (!supabase) {
        try {
            supabase = await waitForSupabase();
        } catch (e) {
            console.error('Supabase failed to load for Relax page', e);
            Object.values(containers).forEach(c => {
                if (c) c.innerHTML = '<div style="padding:20px;color:#ff6b6b">Connection failed. Please refresh.</div>';
            });
            return;
        }
    }

    //Reuse if already loaded
    if (window.allTracks) {
        distributeTracks(window.allTracks, containers);
        return;
    }

    const { data, error } = await supabase.from('meditations').select('*');
    if (error) {
        console.error('Error fetching tracks:', error);
        Object.values(containers).forEach(c => {
            if (c) c.innerHTML = '<div style="padding:20px;color:#ff6b6b">Failed to load tracks.</div>';
        });
        return;
    }

    if (!data || data.length === 0) {
        Object.values(containers).forEach(c => {
            if (c) c.innerHTML = '<div style="padding:20px;color:rgba(255,255,255,0.5)">No content available.</div>';
        });
        return;
    }

    window.allTracks = data;
    distributeTracks(data, containers);

    initAudioPlayer();
}

function distributeTracks(tracks, containers) {
    // Clear loaders
    Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

    tracks.forEach(track => {
        // Fallback for categories not exact match
        let cat = track.category;
        // Map old/new categories if needed
        if (cat === 'Beginner') cat = 'Meditation';
        if (cat === 'Anxiety') cat = 'Meditation';

        const container = containers[cat];
        if (container) {
            container.innerHTML += createCompactCard(track);
        }
    });
}

function createCompactCard(track) {
    // Category-based placeholder images from Unsplash
    const categoryImages = {
        'Sleep': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        'Meditation': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
        'Sounds': 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop',
        'Focus': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
        'Anxiety': 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop',
        'Beginner': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
    };

    const imageUrl = categoryImages[track.category] || categoryImages['Meditation'];

    return `
        <div class="audio-card-compact" onclick="window.playTrack('${track.id}')">
            <div class="audio-thumb-compact">
                <img src="${imageUrl}" alt="${track.title}" loading="lazy">
            </div>
            <div class="audio-info-compact">
                <div class="audio-title-compact">${track.title}</div>
                <div class="audio-dur-compact">${Math.floor(track.duration_sec / 60)} min</div>
            </div>
        </div>
    `;
}

// Breathing Widget
window.toggleBreathing = () => {
    const circle = document.getElementById('breathCircle');
    const text = document.getElementById('breathText');
    const btn = document.querySelector('.breathing-widget-container button');

    if (breathingInterval) {
        // Stop
        clearInterval(breathingInterval);
        breathingInterval = null;
        circle.className = 'breathing-circle';
        text.textContent = 'Breathe';
        btn.textContent = 'Start Breathing';
        return;
    }

    btn.textContent = 'Stop';

    const breatheCycle = () => {
        text.textContent = 'Inhale';
        circle.className = 'breathing-circle inhale';

        setTimeout(() => {
            text.textContent = 'Hold';
            circle.className = 'breathing-circle hold';

            setTimeout(() => {
                text.textContent = 'Exhale';
                circle.className = 'breathing-circle exhale';
            }, 7000); // Hold for 7s (4-7-8 technique is hard, let's do 4-4-4 for simplicity or stick to 4-7-8)
            // Let's do a simple 4-4-4 for visual ease
            // Inhale 4s, Hold 4s, Exhale 4s
        }, 4000);
    };

    breatheCycle();
    breathingInterval = setInterval(breatheCycle, 12000); // 4+4+4 = 12s
}

window.filterRelax = (cat) => {
    // Simple scroll to section for now, or could filter a full list view
    const section = document.getElementById(`scroll-${cat}`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        section.parentElement.style.animation = 'pulse 1s';
    }
}

function initAudioPlayer() {
    const audio = document.getElementById('mainAudio');
    const playBtn = document.getElementById('playPauseBtn');
    if (!audio || !playBtn) return;

    // Avoid adding listeners multiple times
    if (audio.hasAttribute('data-init')) return;
    audio.setAttribute('data-init', 'true');

    playBtn.addEventListener('click', () => {
        if (audio.paused) audio.play(); else audio.pause();
    });

    audio.addEventListener('play', () => { playBtn.textContent = '⏸'; });
    audio.addEventListener('pause', () => { playBtn.textContent = '▶'; });
    audio.addEventListener('timeupdate', () => {
        const m = Math.floor(audio.currentTime / 60);
        const s = Math.floor(audio.currentTime % 60);
        const dur = Math.floor(audio.duration || 0);
        const dm = Math.floor(dur / 60);
        const ds = Math.floor(dur % 60);
        document.getElementById('playerTime').textContent = `${m}:${s.toString().padStart(2, '0')} / ${dm}:${ds.toString().padStart(2, '0')}`;
    });
}

window.playTrack = (id) => {
    const track = window.allTracks.find(t => t.id === id);
    if (!track) return;

    document.getElementById('playerBar').classList.add('active');
    document.getElementById('playerTitle').textContent = track.title;
    const audio = document.getElementById('mainAudio');
    audio.src = track.audio_url;
    audio.play();
}


// --- Learn Page Logic ---
const learnContent = {
    anxiety: `
        <h1>Understanding Anxiety</h1>
        <p>Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come.</p>
        <div class="key-takeaway"><strong>Key Insight:</strong> Anxiety is not "bad" — it's a survival mechanism gone into overdrive.</div>
        <h2>The 5-4-3-2-1 Technique</h2>
        <ul><li>5 things you see</li><li>4 things you feel</li><li>3 things you hear</li><li>2 things you smell</li><li>1 thing you taste</li></ul>
    `,
    sleep: `
        <h1>The Science of Sleep Hygiene</h1>
        <p>Good sleep hygiene is important because of the crucial role sleep plays in your mental and physical health.</p>
        <h2>Tips</h2>
        <ul><li>Stick to a schedule</li><li>Avoid screens before bed</li><li>Keep bedroom cool and dark</li></ul>
    `,
    cbt: `
        <h1>Thinking Traps (Cognitive Distortions)</h1>
        <p>Cognitive distortions are irrational thoughts that can influence your emotions.</p>
        <h2>Common Traps</h2>
        <ul><li><strong>All-or-Nothing:</strong> Thinking in extremes.</li><li><strong>Catastrophizing:</strong> Expecting the worst.</li></ul>
    `
};

window.openArticle = (id) => {
    const content = learnContent[id];
    if (content) {
        document.getElementById('article-content').innerHTML = content;
        document.getElementById('modal-article').classList.add('active');
    }
};

window.closeModal = (id) => {
    if (id === 'article') {
        document.getElementById('modal-article').classList.remove('active');
    } else {
        // Reuse existing if available, or just remove class
        const m = document.getElementById('modal-' + id);
        if (m) m.classList.remove('active');
    }
}

function initLearn() {
    const grid = document.getElementById('learnGrid');
    if (!grid) return;

    // Static content, but generated by JS to keep HTML clean? 
    // Or just check if empty.
    if (grid.children.length > 0) return;

    grid.innerHTML = `
        <div class="course-card" onclick="window.openArticle('anxiety')">
            <div class="course-thumb" style="background: linear-gradient(45deg, #FF6B6B, #EE5253)">🌪️</div>
            <div class="course-content">
                <span class="course-tag">Basics</span>
                <h3 class="course-title">Understanding Anxiety</h3>
                <p class="course-desc">Why we feel anxious and the fight-or-flight response.</p>
            </div>
        </div>
        <div class="course-card" onclick="window.openArticle('sleep')">
            <div class="course-thumb" style="background: linear-gradient(45deg, #5F27CD, #341F97)">😴</div>
            <div class="course-content">
                <span class="course-tag">Wellness</span>
                <h3 class="course-title">Science of Sleep</h3>
                <p class="course-desc">How to fix your sleep schedule and the importance of sleep hygiene.</p>
            </div>
        </div>
        <div class="course-card" onclick="window.openArticle('cbt')">
            <div class="course-thumb" style="background: linear-gradient(45deg, #1DD1A1, #10AC84)">🧠</div>
            <div class="course-content">
                <span class="course-tag">CBT Tools</span>
                <h3 class="course-title">Thinking Traps</h3>
                <p class="course-desc">Learn to identify specific cognitive distortions.</p>
            </div>
        </div>
    `;
}
