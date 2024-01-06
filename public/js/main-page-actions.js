fetch('http://localhost:8080/')
  .then(response => response.text())
  .then(data => {
    return fetch('http://localhost:8080/api/isAuthenticated', {
      credentials: 'include'
    });
  })
  .then(response => {
    if (response.status === 200) {
      response.json().then(data => {
        if (data.success === true) {
          displaySignedInUserContent();
        } else {
          displaySignedOutUserContent();
        }
      });
    } else {
      displaySignedOutUserContent();
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });

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

function proceedSignInForm(event) {
  event.preventDefault();
  if (validateSignInForm() === false) {
    return false;
  }

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const url = 'http://localhost:8080/api/login';
  const data = {
    "email": email,
    "password": password
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        return response.json().then(data => {
          console.log('Success:', data);
          closeUserDiv();
          displaySignedInUserContent();
          displaySuccessfullLoginMessage();
          return true;
        });
      } else if (response.status === 401) {
        return response.json().then(data => {
          console.error('Unauthorized:', data);
          unsuccessfullLoginHandler();
          return false;
        });
      } else {
        // Handle other responses
        return response.json().then(data => {
          console.error('Error:', data);
          return false;
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      return false;
    });
}

function proceedSignUpForm(event) {
  event.preventDefault();
  if (validateSignUpForm() === false) {
    return false;
  }
  let name = document.getElementById("register-name").value;
  let email = document.getElementById("register-email").value;
  let password = document.getElementById("register-password").value;

  const url = 'http://localhost:8080/api/register';
  const data = {
    "name": name,
    "email": email,
    "password": password
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        return response.json().then(data => {
          console.log('Success:', data);
          closeUserDiv();
          displaySuccessfullRegisterMessage();
        });
      } else if (response.status === 400) {
        return response.json().then(data => {
          console.error('Some fields was not filled:', data);
          unsuccessfullRegisterHandler(data.message);
        });
      } else if (response.status === 409) {
        return response.json().then(data => {
          console.error('User with given email already exist already exists:', data);
          unsuccessfullRegisterHandler(data.message);
        });
      }
      else {
        // Handle other responses
        return response.json().then(data => {
          console.error('Error:', data);
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
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

function logout() {
  fetch('http://localhost:8080/api/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.status === 200) {
        return response.json().then(data => {
          console.log('Success:', data);
          displaySignedOutUserContent();
          return true;
        });
      } else {
        // Handle other responses
        return response.json().then(data => {
          console.error('Error:', data);
          return false;
        });
      }
    }
    )
    .catch((error) => {
      console.error('Error:', error);
      return false;
    });
}

function displayLoginRegisterDiv() {
  fetch('/html/user-actions-div-login-register.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('user-actions-div').innerHTML = data;
    })
}

function displaySignedInUserContent() {
  var logout = "<div class='small-div-title'><h3>Logout</h3><button onclick='logout()'>Logout</button></div>";
  document.getElementById('user-actions-div').innerHTML = logout;
}

function displaySignedOutUserContent() {
  fetch('/html/user-actions-div-signed-out.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('user-actions-div').innerHTML = data;
    })
}