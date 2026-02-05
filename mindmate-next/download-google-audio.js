const fs = require('fs');
const https = require('https');
const path = require('path');

// Google Actions Sounds are extremely reliable for nature/weather.
const downloads = [
    // Forest -> Google Forest Atmosphere (OGG)
    { url: "https://actions.google.com/sounds/v1/nature/forest_atmosphere.ogg", dest: "public/audio/forest.ogg" },

    // Ocean -> Google Ocean Waves (OGG)
    { url: "https://actions.google.com/sounds/v1/nature/ocean_waves_large_cliff.ogg", dest: "public/audio/ocean.ogg" },

    // Meditation -> Google Flowing Stream (OGG)
    { url: "https://actions.google.com/sounds/v1/water/stream_flowing.ogg", dest: "public/audio/meditation.ogg" },

    // Rain -> Google Rain Heavy (OGG)
    { url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg", dest: "public/audio/rain.ogg" },

    // Bedtime -> Librivox generic (MP3) - trying a known stable collection
    // Using a specific file from a Project Gutenberg/Librivox collection that is widely mirrored.
    { url: "https://ia802606.us.archive.org/13/items/myth_folklore/myth_folklore_01_various_64kb.mp3", dest: "public/audio/bedtime-story.mp3" },

    // Lofi -> SoundHelix Test Song (reliable fallback for music)
    { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", dest: "public/audio/lofi.mp3" }
];

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const file = fs.createWriteStream(dest);
        const options = {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        };

        https.get(url, options, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                if (response.headers.location) {
                    console.log(`Redirecting ${url} -> ${response.headers.location}`);
                    downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                    return;
                }
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed ${url} (${response.statusCode})`));
                return;
            }

            // Check content type just in case
            const cType = response.headers['content-type'];
            if (cType && cType.includes('text/html')) {
                reject(new Error(`Got HTML for ${url}`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    console.log(`Saved: ${dest} (${file.bytesWritten} bytes)`);
                    resolve();
                });
            });
        }).on('error', err => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

async function run() {
    console.log("Downloading verified assets...");
    for (const item of downloads) {
        try {
            await downloadFile(item.url, item.dest);
        } catch (e) {
            console.error(`Error downloading ${item.dest}: ${e.message}`);
        }
    }
}

run();
