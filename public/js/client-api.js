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
          console.log('Successfull registration');
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

function saveWaveProfile() {
  getUserId().then(userId => {
    var waveProfile = {
      amplitude: document.getElementById('amplitudeRange').value,
      frequency: document.getElementById('frequencyRange').value,
      speed: document.getElementById('speedRange').value,
      "userId": userId
    };

    fetch('/api/saveWaveProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(waveProfile)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          alert('Wave profile saved successfully!');
        } else {
          alert('Error saving wave profile!');
        }
      });
  }).catch(err => {
    console.log(err);
  });
  fetchWaveProfilesForUser();
}

function fetchWaveProfilesForUser() {
  getUserId().then(userId => {
    fetch('/api/getWaveProfilesForUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'userId': userId
      }
    })
      .then(response => response.json())
      .then(data => {
        var select = document.createElement('select');
        select.id = 'wave-profiles-select';
        var defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select wave profile';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);
        if (data.success) {
          data.data.forEach(profile => {
            var option = document.createElement('option');
            option.value = `${profile.amplitude},${profile.frequency},${profile.speed}`;
            option.textContent = `A:${profile.amplitude}m, f:${profile.frequency}Hz, v:${profile.speed}m/s`;
            select.appendChild(option);
          });
          document.getElementById('wave-profiles-div-content').innerHTML = '';
          document.getElementById('wave-profiles-div-content').appendChild(select);
        } else {
          alert('Error fetching wave profiles!');
        }
      });
  }).catch(err => {
    console.log(err);
  });
}

function getUserId() {
  return new Promise((resolve, reject) => {
    fetch('/api/getUserId', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          resolve(data.userId);
        } else {
          reject('Error fetching user id!');
        }
      })
      .catch(err => reject(err));
  });
}