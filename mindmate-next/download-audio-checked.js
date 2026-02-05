const fs = require('fs');
const https = require('https');
const path = require('path');

// Using a mix of highly reliable sources
const downloads = [
    // Bedtime: Storynory (usually reliable direct link)
    { url: "https://www.storynory.com/audio/TheStar.mp3", dest: "public/audio/bedtime-story.mp3" },

    // Ocean: OrangeFreeSounds or similar reliable source, staying with Archive but using a cleaner link if possible, 
    // OR using a known direct Github raw file from a public sample repo if found. 
    // Let's try a different Archive link that is less likely to be a landing page.
    // "https://ia800300.us.archive.org/1/items/OceanWavesCrashing/Ocean_Waves_Crashing.mp3" - using the ia80xxxxx domain is often more direct.
    { url: "https://ia800300.us.archive.org/1/items/OceanWavesCrashing/Ocean_Waves_Crashing.mp3", dest: "public/audio/ocean.mp3" },

    // Meditation: 
    { url: "https://ia802609.us.archive.org/17/items/MindfulnessBell/Mindfulness_Bell.mp3", dest: "public/audio/meditation.mp3" },

    // Forest: 
    { url: "https://ia801400.us.archive.org/34/items/nature-souds-for-sleep-rain-forest/Nature%20Souds%20for%20Sleep%20-%20Rain%20Forest.mp3", dest: "public/audio/forest.mp3" },

    // Rain:
    { url: "https://ia801905.us.archive.org/29/items/heavy-rain-nature-sounds_202104/Heavy%20Rain%20Nature%20Sounds.mp3", dest: "public/audio/rain.mp3" },

    // Lofi:
    { url: "https://ia803006.us.archive.org/3/items/LofiHipHop_201905/Lofi%20Hip%20Hop.mp3", dest: "public/audio/lofi.mp3" }
];

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        // Ensure directory exists
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const file = fs.createWriteStream(dest);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        https.get(url, options, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                console.log(`Redirecting to ${response.headers.location}`);
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }

            // Check if content-type is reasonable (not HTML)
            const contentType = response.headers['content-type'];
            if (contentType && contentType.includes('text/html')) {
                reject(new Error(`URL returned HTML instead of audio: ${url}`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    console.log(`Success: ${dest} (Size: ${file.bytesWritten} bytes)`);
                    resolve();
                });
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

async function run() {
    console.log("Starting downloads...");
    for (const item of downloads) {
        try {
            await downloadFile(item.url, item.dest);
        } catch (e) {
            console.error(`Error: ${e.message}`);
        }
    }
}

run();
