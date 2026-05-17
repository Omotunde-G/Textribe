document.addEventListener("DOMContentLoaded", () => {
    const likeBtn = document.querySelector(".like-btn");
    const commentBtn = document.querySelector(".comment-btn");
    const contributeBtn = document.querySelector(".contribute-btn");
    const exitBtn = document.querySelector(".exit-btn");

    const contributeSection = document.getElementById("contributeSection");
    const contributeTextarea = document.getElementById("contributeTextarea");
    const cancelBtn = document.getElementById("cancelBtn");
    const submitBtn = document.getElementById("submitBtn");

   

    // Show contribute section when "Contribute" button is clicked
    contributeBtn.addEventListener("click", () => {
        const username = prompt("Please enter your username:");
        if (!username) {
          alert("Username is required to contribute.");
          return;
        }
        contributeSection.style.display = "block";
        contributeTextarea.focus();
    });

    // Hide contribute section when "Cancel" button is clicked
    cancelBtn.addEventListener("click", () => {
        contributeSection.style.display = "none";
        contributeTextarea.value = "";
    });

    // Handle "Submit" button click
    submitBtn.addEventListener("click", () => {
        const newContent = contributeTextarea.value.trim();
        if (newContent) {
            // Prompt the user for their username
            const username = prompt("Please enter your username:");

            if (username) {
                // Get the story content and author elements
                const storyContent = document.getElementById("story-content");
                const storyAuthor = document.getElementById("story-author");

                // Update the story content
                storyContent.innerHTML += `<p>${newContent}</p>`;
                
                // Update the author to include the contributor's username
                storyAuthor.innerHTML += ` & ${username}`;

                // Hide the contribute section and clear the textarea
                contributeSection.style.display = "none";
                contributeTextarea.value = "";
            } else {
                alert("Username cannot be empty. Please try again.");
            }
        }
    });

    // Other event listeners...
});
