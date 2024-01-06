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
  document.getElementById('wave-properties-div-buttons').innerHTML = "<button onclick='saveProperties()'>Save</button>";
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
}

function hideSimulatorModeDiv() {
  var simulatorModeDiv = document.getElementById('simulator-mode-div');
  simulatorModeDiv.innerHTML = '';
  simulatorModeDiv.style.display = 'none';
}

function displayWaveProfilesDiv() {
  document.getElementById('wave-profiles-div').style.display = 'block';
  // fetch wave profiles from server and add them to the div
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