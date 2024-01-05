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
  var loginForm = "<h2>Sign in</h2>"
    + "<form name='login-form' id='login-form' class='user-form' action='#' method='post' onsubmit='proceedSignInForm(event)'>"
    + "<label for='email'>Email:</label>"
    + "<input type='email' name='email' id='email' autocomplete='email' required>"
    + "<label for='password'>Password:</label>"
    + "<input type='password' name='password' id='password' autocomplete='current-password' required>"
    + "<button>Submit</button>"
    + "</form>";
  document.getElementById('user-div-content').innerHTML += loginForm;
}

function displaySignUpForm() {
  document.getElementById('login-register-logout-div').style.display = 'block';
  blurBackground('login-register-logout-div');
  var registerForm = "<h2>Sign up</h2>"
    + "<form name='register-form' id='register-form' class='user-form' action='#' onsubmit='return proceedSignUpForm(event)' method='post'>"
    + "<label for='register-name'>Name:</label>"
    + "<input type='text' name='register-name' id='register-name' minlength='4' maxlength='20' autocomplete='name' required>"
    + "<label for='register-email'>Email:</label>"
    + "<input type='email' name='register-email' id='register-email' minlength='5' autocomplete='email' required>"
    + "<label for='register-password'>Password:</label>"
    + "<input type='password' name='register-password' id='register-password' minlength='8' maxlength='40' autocomplete='new-password' required>"
    + "<label for='confirm-password'>Confirm password:</label>"
    + "<input type='password' name='confirm-password' id='confirm-password' minlength='8' maxlength='40' autocomplete='new-password' required>"
    + "<button>Submit</button>"
    + "</form>";
    document.getElementById('user-div-content').innerHTML += registerForm;
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