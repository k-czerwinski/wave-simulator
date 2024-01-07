let amplitude = 0.5;
let frequency = 5;
let speed = 1;

// Function to generate wave data based on amplitude, frequency, speed, and time
function generateWaveData(time) {
    const waveData = [];
    for (let i = 0; i < 600; i++) {
        const value = 100 * amplitude * Math.sin((2 * Math.PI * frequency * i) / 600 + (speed * time / 1000));
        waveData.push(value);
    }
    return waveData;
}

self.onmessage = function (event) {
    if (event.data.amplitude !== undefined) {
        amplitude = event.data.amplitude;
        frequency = event.data.frequency;
        speed = event.data.speed || 1;
    }

    const time = event.data.time || 0;

    const waveData = generateWaveData(time);
    self.postMessage(waveData);
};
