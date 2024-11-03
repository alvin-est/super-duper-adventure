const loginFormHandler = async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();
  
    if (email && password) {
      const response = await fetch('/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // alert("Succesfully logged in!");  /* include or not */
        document.location.replace('/dashboard');
      } else {
        alert('Failed to log in');
      }
    }
};
  
  document.getElementById("loginButton").addEventListener('click', loginFormHandler);
  
// Add real-time validation for immediate feedback
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