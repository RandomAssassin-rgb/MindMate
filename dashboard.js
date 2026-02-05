
// dashboard.js

// Initialize Supabase
const supabase = createClient(window.MindMateConfig.SUPABASE_URL, window.MindMateConfig.SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    loadDashboardData();

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) window.location.href = 'index.html';
    });
});

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        // For security in a real app, redirect. 
        // For this demo, we assume if they are here, they are authorized.
        // window.location.href = 'index.html'; 
        console.log('No session, but allowing view for demo.');
    }
}

async function loadDashboardData() {
    try {
        const [riskData, moodData, videoData] = await Promise.all([
            fetchRiskAlerts(),
            fetchMoodLogs(),
            fetchVideoHistory()
        ]);

        // Collect User IDs to fetch profiles
        const userIds = new Set([
            ...riskData.map(d => d.user_id),
            ...moodData.map(d => d.user_id),
            ...videoData.map(d => d.user_id)
        ]);

        const profiles = await fetchProfiles(Array.from(userIds));

        renderRiskSection(riskData, profiles);
        renderMoodSection(moodData, profiles);
        renderVideoSection(videoData, profiles);
        updateStats(riskData, moodData, profiles);

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function fetchRiskAlerts() {
    // Fetch PHQ-9 > 9 (Moderate to Severe)
    const { data, error } = await supabase
        .from('phq9_results')
        .select('*')
        .gt('score', 9)
        .order('completed_at', { ascending: false })
        .limit(10);

    if (error) console.error('Error fetching risk:', error);
    return data || [];
}

async function fetchMoodLogs() {
    const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .order('logged_at', { ascending: false })
        .limit(10);

    if (error) console.error('Error fetching moods:', error);
    return data || [];
}

async function fetchVideoHistory() {
    const { data, error } = await supabase
        .from('video_calls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) console.error('Error fetching video:', error);
    return data || [];
}

async function fetchProfiles(userIds) {
    if (userIds.length === 0) return {};
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

    if (error) console.error('Profiles error:', error);

    const map = {};
    if (data) {
        data.forEach(p => map[p.id] = p);
    }
    return map;
}

// --- Rendering ---

function renderRiskSection(data, profiles) {
    const container = document.getElementById('riskList');
    if (data.length === 0) {
        container.innerHTML = '<p class="loading-text">No high risk alerts found.</p>';
        return;
    }

    container.innerHTML = data.map(item => {
        const profile = profiles[item.user_id] || { full_name: 'Unknown User' };
        const date = new Date(item.completed_at).toLocaleDateString();

        return `
        <div class="list-item risk-item">
            <div class="user-info">
                <h4>${profile.full_name}</h4>
                <p>Assessed: ${date}</p>
            </div>
            <div class="risk-score">
                <div class="score-val">${item.score}</div>
                <div class="score-label">PHQ-9</div>
            </div>
        </div>`;
    }).join('');
}

function renderMoodSection(data, profiles) {
    const container = document.getElementById('moodList');
    if (data.length === 0) {
        container.innerHTML = '<p class="loading-text">No recent activity.</p>';
        return;
    }

    const moodEmojis = { 5: '😄', 4: '🙂', 3: '😐', 2: '😔', 1: '😫' };

    container.innerHTML = data.map(item => {
        const profile = profiles[item.user_id] || { full_name: 'Unknown User' };
        const timeAgo = getTimeAgo(new Date(item.logged_at));

        return `
        <div class="list-item mood-item">
            <div class="mood-emoji">${moodEmojis[item.mood_score] || '❓'}</div>
            <div class="mood-details">
                <h4>${profile.full_name} <span class="time-ago">• ${timeAgo}</span></h4>
                <p>${item.note || 'No note added.'}</p>
            </div>
        </div>`;
    }).join('');
}

function renderVideoSection(data, profiles) {
    const container = document.getElementById('videoList');
    if (data.length === 0) {
        container.innerHTML = '<p class="loading-text">No calls recorded.</p>';
        return;
    }

    container.innerHTML = data.map(item => {
        const profile = profiles[item.user_id] || { full_name: 'Unknown User' };
        const date = new Date(item.created_at).toLocaleString();
        const duration = item.duration_minutes ? `${item.duration_minutes}m` : (item.ended_at ? 'Completed' : 'In Progress');

        return `
        <div class="list-item video-item">
            <div class="user-info">
                <h4>${profile.full_name}</h4>
                <p>${date}</p>
            </div>
            <div class="duration">
                ${duration}
            </div>
        </div>`;
    }).join('');
}

function updateStats(risk, mood, profiles) {
    document.getElementById('statHighRisk').textContent = risk.length;
    document.getElementById('statActiveStudents').textContent = Object.keys(profiles).length; // rough proxy
    document.getElementById('statMoods24h').textContent = mood.length; // roughly recent
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
}
