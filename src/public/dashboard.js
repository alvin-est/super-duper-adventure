/* Event listener for image load */
document.addEventListener('DOMContentLoaded', function() {
    const img = document.getElementById('imgExt');
    const buffer = document.getElementById('buffer');

    // Check if the image has loaded
    function checkImageLoaded() {
        if (img.complete) {
            console.log("Image has loaded.");
            // Image is loaded, stop checking and call the function
            clearInterval(imgCheckInterval);
            imageLoadedFunction();
        }
    }

    // Execute once image is loaded
    function imageLoadedFunction() {
        // Remove Pico CSS loading spinner
        buffer.setAttribute('aria-busy', 'false'); 
    }

    // Start checking if the image is loaded every 100ms
    var imgCheckInterval = setInterval(checkImageLoaded, 100);
});

/* Event listener for deleting a post */
document.addEventListener('DOMContentLoaded', () => {
    const deleteLinks = document.querySelectorAll('.post-delete');

    deleteLinks.forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            const postId = this.getAttribute('data-post-id');

            if (confirm("Are you sure you want to delete this post?")) {
                try {
                    const response = await fetch(`/user/removePost/${postId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ user_id: postId })
                    });

                    if (response.ok) {
                        const result = await response.json();
                        alert(result.message);
                        // Reload the page
                        window.location.reload();
                    } else {
                        const error = await response.json();
                        alert(error.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while deleting the post');
                }
            }
        });
    });
});

/* Event listener for editing a post */
document.addEventListener('DOMContentLoaded', () => {
    const editLinks = document.querySelectorAll('.post-edit');

    editLinks.forEach(link => {
        link.addEventListener('click', async function(e) {

            e.preventDefault();
            const postId = this.getAttribute('data-post-id');

            // Set the post ID in the hidden input field when user clicks edit
            alert("Editing post with ID: " + postId);
            document.querySelector('#edit-id').value = postId;

            // Select the dialog element
            document.querySelector('dialog').showModal();
        });
    });
});