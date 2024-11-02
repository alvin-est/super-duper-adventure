/* Event listener for submitting an edited post */
const editPostFormHandler = async (event) => {
    event.preventDefault();

    // Receive user input
    const postId = document.querySelector('#edit-id').value.trim();
    const newTitle = document.querySelector('#edit-title').value.trim();
    const newContent = document.querySelector('#edit-content').value.trim();

    // Validation
    if (!newTitle || !newContent) {
        alert("Title and content must not be empty.");
        return;
    }

    // Send a PUT request to the server
    try {
        const response = await fetch(`/user/editPost/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle, content: newContent })
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            // Redirect to homepage
            location.reload();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while editing the post');
    }
};

/* Button event listener */
document.querySelector("#edit-submit").addEventListener('click', editPostFormHandler);