let amplitude = 50;
let frequency = 5;
let speed = 1;

// Function to generate wave data based on amplitude, frequency, speed, and time
function generateWaveData(time) {
    const waveData = [];
    for (let i = 0; i < 600; i++) {
        const value = amplitude * Math.sin((2 * Math.PI * frequency * i) / 600 + (speed * time / 1000));
        waveData.push(value);
    }
    return waveData;
}

// Event listener for messages from the main thread
self.onmessage = function (event) {
    if (event.data.amplitude !== undefined) {
        amplitude = event.data.amplitude;
        frequency = event.data.frequency;
        speed = event.data.speed || 1; // Set default speed to 1 if not provided
    }

    const time = event.data.time || 0;

    // Generate wave data and send it back to the main thread
    const waveData = generateWaveData(time);
    self.postMessage(waveData);
};
