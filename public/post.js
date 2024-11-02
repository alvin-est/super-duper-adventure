/* Form handler */
const postFormHandler = async (event) => {
    event.preventDefault();
  
    // Receive user input
    const title = document.querySelector('#title').value.trim();
    const content = document.querySelector('#content').value.trim();

    // Run code if neither field are empty
    if (title && content) {
      // POST request to back-end server route (inserts user record into DB)
      const response = await fetch('/user/post', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        alert("Succesfully posted!");
        document.location.replace('/');
      } else {
        alert('Failed to post: ' + response.statusText);
        console.log(response);
      }
    }
    else {
        alert("Blog post must have a title and content.");
    }
  };

/* Button event listener */
document.getElementById("postButton").addEventListener('click', postFormHandler);