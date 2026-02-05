// Supabase Configuration for MindMate - Robust Loader
(function () {
    const CONFIG = {
        URL: 'https://xjmusrcstcandctkrywm.supabase.co',
        KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbXVzcmNzdGNhbmRjdGtyeXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTI5NTEsImV4cCI6MjA4NTUyODk1MX0.qcp1pl1wS32CXYtkV-JPF1lWDtd6tWkMfF7uuf6w1hA'
    };

    // Initialize global config object
    window.MindMateConfig = {
        supabase: null,
        SUPABASE_URL: CONFIG.URL,
        SUPABASE_ANON_KEY: CONFIG.KEY,
        EDGE_FUNCTIONS: {
            chat: `${CONFIG.URL}/functions/v1/chat`,
            phq9Score: `${CONFIG.URL}/functions/v1/phq9-score`,
            gad7Score: `${CONFIG.URL}/functions/v1/gad7-score`,
            logMood: `${CONFIG.URL}/functions/v1/log-mood`,
            logVideoCall: `${CONFIG.URL}/functions/v1/log-video-call`,
        }
    };

    // Poll for Supabase library availability
    const initInterval = setInterval(() => {
        if (window.supabase) {
            clearInterval(initInterval);
            console.log("Supabase library loaded, initializing client...");
            try {
                window.MindMateConfig.supabase = window.supabase.createClient(CONFIG.URL, CONFIG.KEY);
            } catch (e) {
                console.error("Failed to create Supabase client:", e);
            }
        }
    }, 50); // Check every 50ms

    // Timeout safety (stop checking after 10s)
    setTimeout(() => clearInterval(initInterval), 10000);
})();
