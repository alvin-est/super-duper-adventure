/* Form handler */
const registrationFormHandler = async (event) => {
    event.preventDefault();
  
    // Receive user input
    const username = document.querySelector('#username').value.trim();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();

    // Simple front-end password length validation
    if(password.length < 8) {
        alert("Password must be more than 8 characters!");
        return;
    }

    // Run code if neither field are empty
    if (username && email) {
      // POST request to back-end server route (inserts user record into DB)
      const response = await fetch('/user/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        alert("Succesfully registered!");
        document.location.replace('/login');
      } else {
        alert('Failed to create account: ' + response);
        console.log(response);
      }
    }
  };

/* Button event listener */
document.getElementById("submit").addEventListener('click', registrationFormHandler);