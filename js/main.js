// Initialize web worker
const waveWorker = new Worker('/js/wave-worker.js');

const amplitudeRange = document.getElementById('amplitudeRange');
const frequencyRange = document.getElementById('frequencyRange');
const speedRange = document.getElementById('speedRange'); 
const waveCanvas = document.getElementById('waveCanvas');
const ctx = waveCanvas.getContext('2d');

const animationInterval = 50; 
let animationRequestId;
let currentTime = 0;

// Event listeners for range input changes
amplitudeRange.addEventListener('input', updateParameters);
frequencyRange.addEventListener('input', updateParameters);
speedRange.addEventListener('input', updateParameters);

// Function to update parameters and start animation
function updateParameters() {
    const amplitude = amplitudeRange.value;
    const frequency = frequencyRange.value;
    const speed = speedRange.value; 
    waveWorker.postMessage({ amplitude, frequency, speed });

    // Clear previous animation frame request
    cancelAnimationFrame(animationRequestId);

    // Start animation
    animateWave();
}

// Function to animate the wave
function animateWave() {
    // Request next animation frame
    animationRequestId = requestAnimationFrame(animateWave);

    // Update time for animation
    currentTime += animationInterval;

    // Draw wave on canvas
    drawWave();
}

function drawWave() {
    waveWorker.postMessage({ time: currentTime });
}

waveWorker.onmessage = function (event) {
    const waveData = event.data;

    ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);

    ctx.beginPath();
    ctx.moveTo(0, waveCanvas.height / 2);

    for (let i = 0; i < waveData.length; i++) {
        const x = (i / waveData.length) * waveCanvas.width;
        const y = (waveData[i] / 100) * (waveCanvas.height / 2) + waveCanvas.height / 2;
        ctx.lineTo(x, y);
    }

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
};

updateParameters();
