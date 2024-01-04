function displayKnowledgePage() {
  document.getElementById('knowledge-content').style.display = 'block';
  blurBackground('knowledge-content');
}

function closeKnowledgePage() {
  document.getElementById('knowledge-content').style.display = 'none';
  removeBlur();
}

function displayVideoPage() {
  document.getElementById('wave-video').style.display = 'block';
  blurBackground('wave-video');
}

function closeVideoPage() {
  document.getElementById('wave-video').style.display = 'none';
  removeBlur();
}

function blurBackground(notToBlur) {
  Array.from(document.body.children).forEach(child => {
    if (child.id !== notToBlur) {
      child.classList.add('blur');
    }
  });
}

function removeBlur() {
  Array.from(document.body.children).forEach(child => {
    child.classList.remove('blur');
  });
}

function updateSpeedValue(newValue) {
  document.getElementById("speedValue").innerHTML = newValue + "m/s";
}

function updateFrequencyValue(newValue) {
  document.getElementById("frequencyValue").innerHTML = newValue + "Hz";
}

function updateAmplitudeValue(newValue) {
  document.getElementById("amplitudeValue").innerHTML = newValue / 100 + "m";
}