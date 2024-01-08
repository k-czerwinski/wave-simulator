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
  document.getElementById('wave-video-div-content').innerHTML = `<iframe id='wave - video - player' src='https://www.youtube.com/embed/c38H6UKt3_I?si=6GvT-pAzDtOnG0V0'
  title = 'Media player with video about waves'
  width='100%' height='100%'
  allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
  allowfullscreen>
  </iframe>`;
  blurBackground('wave-video');
}

function closeVideoPage() {
  document.getElementById('wave-video').style.display = 'none';
  document.getElementById('wave-video-div-content').innerHTML = '';
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
  document.getElementById("amplitudeValue").innerHTML = newValue + "m";
}

function displaySignInForm() {
  document.getElementById('login-register-logout-div').style.display = 'block';
  blurBackground('login-register-logout-div');
  fetch('/html/login-form.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('user-div-content').innerHTML = data;
    })
}

function displaySignUpForm() {
  document.getElementById('login-register-logout-div').style.display = 'block';
  blurBackground('login-register-logout-div');
  fetch('/html/register-form.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('user-div-content').innerHTML = data;
    })
}

function closeUserDiv() {
  var div = document.getElementById('login-register-logout-div');
  div.style.display = 'none';
  removeBlur();
  document.getElementById('user-div-content').innerHTML = '';
}

function validateSignUpForm() {
  var form = document.getElementById('register-form');
  if (form.checkValidity() === false) {
    form.reportValidity();
    return false;
  }

  var password = document.getElementById('register-password').value;
  var confirmPassword = document.getElementById('confirm-password').value;
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return false;
  }
}

function validateSignInForm() {
  var form = document.getElementById('login-form');
  if (form.checkValidity() === false) {
    form.reportValidity();
    return false;
  }
}

function displaySuccessfullLoginMessage() {
  document.getElementById('login-register-logout-div').style.display = 'block';
  blurBackground('login-register-logout-div');
  var successMessage = "<h2>Successfull login!</h2>";
  document.getElementById('user-div-content').innerHTML += successMessage;
}

function unsuccessfullLoginHandler() {
  alert('Wrong username or password!');
}

function displaySuccessfullRegisterMessage() {
  document.getElementById('login-register-logout-div').style.display = 'block';
  blurBackground('login-register-logout-div');
  var successMessage = "<h2>Successfull registration!</h2>";
  successMessage += "<p>You can now log in.</p>"
  document.getElementById('user-div-content').innerHTML += successMessage;
}

function unsuccessfullRegisterHandler(message) {
  alert(message);
}

function displayLoginRegisterDiv() {
  fetch('/html/user-actions-unauthorized.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('user-actions-div').innerHTML = data;
    })
}

function displaySignedInUserContent() {
  displaySimulatorModeDiv();
  displayAuthorizedUserActionDiv();
  displayWaveProfilesDiv();
  document.getElementById('wave-properties-div-buttons').innerHTML = "<button onclick='saveWaveProfile()'>Save</button>";
}

function displaySignedOutUserContent() {
  displayUnauthorizedUserActionDiv();
  hideSimulatorModeDiv();
  hideWaveProfilesDiv();
  document.getElementById('wave-properties-div-buttons').innerHTML = '';
}

function displaySimulatorModeDiv() {
  var simulatorModeDiv = document.getElementById('simulator-mode-div');
  simulatorModeDiv.style.display = 'block';
  fetch('/html/simulator-mode.html')
    .then(response => response.text())
    .then(data => {
      simulatorModeDiv.innerHTML = data;
    });

  grayOutDiv('wave-profiles-div');
  simulatorModeDiv.addEventListener('change', function (event) {
    if (event.target.id === 'toggle') {
      if (event.target.checked) {
        grayOutDiv('wave-properties-div');
        removeGrayOutDiv('wave-profiles-div');
      } else {
        grayOutDiv('wave-profiles-div');
        removeGrayOutDiv('wave-properties-div');
      }
    }
  });
}

function hideSimulatorModeDiv() {
  var simulatorModeDiv = document.getElementById('simulator-mode-div');
  simulatorModeDiv.innerHTML = '';
  simulatorModeDiv.style.display = 'none';
  removeGrayOutDiv('wave-properties-div');
}

function displayWaveProfilesDiv() {
  document.getElementById('wave-profiles-div').style.display = 'block';
  fetchWaveProfilesForUser();
}

function hideWaveProfilesDiv() {
  document.getElementById('wave-profiles-div').style.display = 'none';
  document.getElementById('wave-profiles-div-content').innerHTML = '';
}

function displayAuthorizedUserActionDiv() {
  fetch('/html/user-actions-authorized.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('user-actions-div').innerHTML = data;
    });
}

function displayUnauthorizedUserActionDiv() {
  fetch('/html/user-actions-unauthorized.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('user-actions-div').innerHTML = data;
    });
}

function grayOutDiv(divId) {
  var div = document.getElementById(divId);
  div.classList.add('overlay');
}

function removeGrayOutDiv(divId) {
  var div = document.getElementById(divId);
  div.classList.remove('overlay');
}

function applyWaveProfile() {
  var select = document.getElementById('wave-profiles-select');
  if (select.value === '') {
    alert('Please select a wave profile!');
    return;
  }
  var values = document.getElementById('wave-profiles-select').value.split(',');
  var amplitude = values[0];
  var frequency = values[1];
  var speed = values[2];
  document.getElementById('amplitudeRange').value = amplitude;
  document.getElementById('frequencyRange').value = frequency;
  document.getElementById('speedRange').value = speed;
  updateAmplitudeValue(amplitude);
  updateFrequencyValue(frequency);
  updateSpeedValue(speed);
  updateParameters();
}