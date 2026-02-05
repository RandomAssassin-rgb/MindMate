[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$files = @(
    @("https://archive.org/download/short_story_001_0801_librivox/shortstory001_thestar_wells_gam_64kb.mp3", "public/audio/bedtime-story.mp3"),
    @("https://archive.org/download/OceanWavesCrashing/Ocean_Waves_Crashing.mp3", "public/audio/ocean.mp3"),
    @("https://archive.org/download/MindfulnessBell/Mindfulness_Bell.mp3", "public/audio/meditation.mp3"),
    @("https://archive.org/download/nature-souds-for-sleep-rain-forest/Nature%20Souds%20for%20Sleep%20-%20Rain%20Forest.mp3", "public/audio/forest.mp3"),
    @("https://archive.org/download/heavy-rain-nature-sounds_202104/Heavy%20Rain%20Nature%20Sounds.mp3", "public/audio/rain.mp3"),
    @("https://archive.org/download/LofiHipHop_201905/Lofi%20Hip%20Hop.mp3", "public/audio/lofi.mp3")
)

foreach ($file in $files) {
    $url = $file[0]
    $output = $file[1]
    Write-Host "Downloading $url to $output..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UserAgent "Mozilla/5.0"
        Write-Host "Success."
    } catch {
        Write-Host "Error downloading $url : $_"
    }
}
