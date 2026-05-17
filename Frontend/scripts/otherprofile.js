document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');  // Extract user_id from the URL query string
    console.log("Extracted user ID:", userId);  // Log to verify the extracted ID
    console.log("URL Parameters:", window.location.search);  // Log the URL parameters

    if (userId) {
        const userId = comment.user_id;  // This should be the actual ID of the user who made the comment
if (userId) {
    const usernameElement = document.createElement("a");
    usernameElement.href = `otherprofile.html?user_id=${userId}`;
    usernameElement.textContent = comment.username;
    commentsContainer.appendChild(usernameElement);  // Append the link to the comments container
} else {
    console.error("user_id is undefined for this comment:", comment);
}

        try {
            const response = await fetch(`http://localhost:3005/users/${userId}`);
            if (response.ok) {
                const userData = await response.json();
                // Display the user data on the page
                document.getElementById('username').textContent = userData.username || 'N/A';
                document.getElementById('fullname').textContent = userData.fullname || 'N/A';
                document.getElementById('email').textContent = userData.email || 'N/A';
                document.getElementById('bio').textContent = userData.bio || 'No bio available';
                // Add other user details as needed
            } else {
                console.error("Failed to load user profile");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    } else {
        console.error("No user_id found in URL");
    }
});
