/* Form handler */
document.addEventListener('DOMContentLoaded', () => {
    // Listen to submit events on the document body
    document.body.addEventListener('submit', async (event) => {
        // Check if the form is a comment form
        if (!event.target.closest('.commentForm')) return;

        event.preventDefault();

        const form = event.target; // The form that was submitted
        const postId = form.dataset.postId; // Using dataset for easy data retrieval
        const content = form.querySelector('input[name="content"]').value.trim(); // Get the comment content

        // Some simple validation
        if (!content) {
            alert('Please enter a comment.');
            return;
        }

        // POST to server
        try {
            const response = await fetch('/user/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, content })
            });

            const data = await response.json();
            console.log('Comment posted:', data);

            alert('Comment posted!', location.reload());

            // Optionally, clear the comment input after posting
            // form.querySelector('input[name="content"]').value = '';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while posting your comment.');
        }
    });
});