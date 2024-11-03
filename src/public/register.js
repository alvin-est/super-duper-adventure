/* Form handler */
const registrationFormHandler = async (event) => {
  event.preventDefault();

  // Receive user input
  const username = document.querySelector('#username').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  // Username validation
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
      document.querySelector('#username').setAttribute('aria-invalid', 'true');
      alert("Username must be alphanumeric with underscores only!");
      return;
  } else {
      document.querySelector('#username').setAttribute('aria-invalid', 'false');
  }

  // Simple front-end password length validation
  if(password.length < 8) {
      document.querySelector('#password').setAttribute('aria-invalid', 'true');
      alert("Password must be at least 8 characters long!");
      return;
  } else {
      document.querySelector('#password').removeAttribute('aria-invalid');
  }

  // Run code if all fields are valid
  if (username && email && password) {
      // POST request to back-end server route (inserts user record into DB)
      const response = await fetch('/user/register', {
          method: 'POST',
          body: JSON.stringify({ username, email, password }),
          headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
          alert("Successfully registered!");
          document.location.replace('/login');
      } else {
          alert('Failed to create account: ' + response.statusText);
          console.log(response);
      }
  }
};

/* Button event listener */
document.getElementById("submit").addEventListener('click', registrationFormHandler);

// Add real-time validation for immediate feedback
document.getElementById('username').addEventListener('input', function(e) {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(e.target.value)) {
      this.setAttribute('aria-invalid', 'true');
  } else {
      this.setAttribute('aria-invalid', 'false');
  }
});

document.getElementById('email').addEventListener('input', function(e) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(e.target.value)) {
      this.setAttribute('aria-invalid', 'true');
  } else {
      this.setAttribute('aria-invalid', 'false');
  }
});

document.getElementById('password').addEventListener('input', function(e) {
  if(e.target.value.length < 8) {
      this.setAttribute('aria-invalid', 'true');
  } else {
      this.setAttribute('aria-invalid', 'false');
  }
});