document.addEventListener("DOMContentLoaded", () => {
  const fullStoryContent = document.getElementById("fullStoryContent");
  const commentBtn = document.querySelector(".comment-btn");
  const commentSection = document.getElementById("commentSection");
  const submitCommentBtn = document.getElementById("submitComment");
  const commentsContainer = document.getElementById("commentsContainer");
  const storyContent = localStorage.getItem("currentStory");
  const storyId = localStorage.getItem("storyId"); // Store the storyId in localStorage when opening the full story
// contribute function

const contributeBtn = document.querySelector(".contribute-btn");
const contributeModal = document.getElementById("contributeModal");
const exitContributionBtn = document.getElementById("exitContributionBtn");
const saveContributionBtn = document.getElementById("saveContributionBtn");
const submitContributionBtn = document.getElementById("submitContributionBtn");

 // Froala editor configuration
 let editorInstance;
  
 const storyTextarea = document.getElementById("contributionText");
 const editorOptions = {
   heightMin: 100,
   placeholderText: 'Write your contribution here...'
 };



 // Open the contribution modal
 contributeBtn.addEventListener("click", () => {
    contributeModal.style.display = "block";
    if (!editorInstance) {
      // Initialize Froala Editor inside the modal
      editorInstance = new FroalaEditor(storyTextarea, editorOptions);
    }
  });

  // Close the modal when Exit is clicked
  exitContributionBtn.addEventListener("click", () => {
    contributeModal.style.display = "none";
  });
// ok1 

document.addEventListener("DOMContentLoaded", () => {
  const fullStoryContent = document.getElementById("fullStoryContent");
  const storyContent = localStorage.getItem("currentStory");

  // Display the story content
  if (storyContent) {
      fullStoryContent.innerHTML = storyContent;

      // Apply styles to contributors' content
      const contributorContents = fullStoryContent.querySelectorAll('.contributor-content');
      contributorContents.forEach((element, index) => {
          // Assign different colors for different contributors
          const colors = ['#FFD700', '#ADFF2F', '#00CED1', '#FF4500']; // example colors
          element.style.backgroundColor = colors[index % colors.length];
          element.style.padding = '10px';
          element.style.margin = '10px 0';
          element.style.borderRadius = '5px';
      });

      const contributorHeaders = fullStoryContent.querySelectorAll('.contributor-header');
      contributorHeaders.forEach((header) => {
          header.style.fontWeight = 'bold';
          header.style.fontSize = '1.2em';
          header.style.marginTop = '20px';
      });
  }
});


  //ok 
  document.addEventListener('DOMContentLoaded', async () => {
    const fullStoryContent = document.getElementById("fullStoryContent");

    // Fetch the story data from localStorage
    const storyContent = localStorage.getItem('currentStory');
    
    if (storyContent) {
        // Parse the story content to extract each contributor and their content
        const contentSections = storyContent.split('Contributor:').filter(Boolean);

        // Clear the fullStoryContent before adding the structured content
        fullStoryContent.innerHTML = '';

        // Loop through each section and apply styles
        contentSections.forEach((section, index) => {
            const [contributorName, ...contentParts] = section.trim().split('\n');
            const content = contentParts.join(' ').trim();

            // Create a div for each contributor's content
            const contributorSection = document.createElement('div');
            contributorSection.classList.add('contributor-section');

            // Create a header for the contributor's name
            const contributorHeader = document.createElement('h3');
            contributorHeader.innerText = `Contributor: ${contributorName}`;
            contributorHeader.classList.add('contributor-header');
            contributorSection.appendChild(contributorHeader);

            // Create a paragraph for the content
            const contentParagraph = document.createElement('p');
            contentParagraph.innerText = content;
            contentParagraph.classList.add('contributor-content', `contributor-${index + 1}`);
            contributorSection.appendChild(contentParagraph);

            // Append the section to the full story content
            fullStoryContent.appendChild(contributorSection);
        });
    }
});


  // Save the contribution locally
  document.getElementById('saveContributionBtn').addEventListener('click', async () => {
    const contributorName = document.getElementById("contributorName").value;
    const contributionText = document.getElementById("contributionText").value;
    const storyId = localStorage.getItem("storyId");

    if (contributorName && contributionText) {
        try {
            const response = await fetch(`http://localhost:3005/collaboration/${storyId}/contribute/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ contributorName, contributionText }),
            });

            if (response.ok) {
                alert("Contribution saved as draft!");
                // Optionally close the modal or reset the form
            } else {
                alert("Failed to save contribution. Please try again.");
            }
        } catch (error) {
            console.error("Error saving draft:", error);
        }
    } else {
        alert("Please fill in all fields before saving.");
    }
});


  // Submit the contribution
  document.getElementById('submitContributionBtn').addEventListener('click', async () => {
    const contributorName = document.getElementById("contributorName").value;
    const contributionText = document.getElementById("contributionText").value;
    const storyId = localStorage.getItem("storyId");

    if (contributorName && contributionText) {
        try {
            const response = await fetch(`http://localhost:3005/collaboration/${storyId}/contribute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ contributorName, contributionText }),
            });

            if (response.ok) {
                alert("Contribution submitted successfully!");
              
                    // Clear the modal fields and editor content after submission
          document.getElementById("contributorName").value = '';
          editorInstance.html.set('');  // Clear Froala editor content
          contributeModal.style.display = "none";  // Close the modal
            } else {
                alert("Failed to submit contribution. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting contribution:", error);
        }
    } else {
        alert("Please fill in all fields before submitting.");
    }
});




//end of it 

  if (storyContent) {
    fullStoryContent.innerHTML = storyContent;
  }

  // Show the comment textarea when "Comment" button is clicked
  commentBtn.addEventListener("click", () => {
    commentSection.style.display = "block";
  });

  // Handle comment submission
  submitCommentBtn.addEventListener("click", async () => {
    // Retrieve and log key variables
    const commentText = document.getElementById("commentText").value;
    const storyId = localStorage.getItem("storyId");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("loggedinusername"); // Ensure username is retrieved

    // Log the data being sent
    console.log("Comment Text:", commentText);
    console.log("Story ID:", storyId);
    console.log("User ID:", userId);

    // Ensure the comment is not empty
    if (commentText.trim() !== "") {
      try {
        // Make the POST request to add a comment
        const response = await fetch(
          `http://localhost:3005/stories/${storyId}/comment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              user_id: userId, // Use the userId retrieved earlier
              comment_text: commentText,
            }),
          }
        );

        // Handle the response
        if (response.ok) {
          const newComment = await response.json();
          // Display the comment immediately
          const commentElement = document.createElement("div");
          commentElement.classList.add("comment");
          commentElement.innerHTML = `
                        <p><strong>${username}</strong>: ${newComment.comment.comment_text}</p>
                    `;
          commentsContainer.appendChild(commentElement);

          // Clear the textarea and hide the comment section
          document.getElementById("commentText").value = "";
          commentSection.style.display = "none";
        } else {
          const errorData = await response.json();
          console.error("Failed to post comment:", errorData);
          alert(
            "Failed to post comment: " + (errorData.message || "Unknown error")
          );
        }
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    } else {
      alert("Comment cannot be empty.");
    }
  });

  // Fetch and display existing comments
  async function loadComments() {
    try {
        const response = await fetch(`http://localhost:3005/stories/${storyId}/comments`);
        if (response.ok) {
            const data = await response.json();
            data.comments.forEach((comment) => {
                const commentElement = document.createElement("div");
                commentElement.classList.add("comment");

                // Create a link for the username pointing to the new otherprofile.html
                const usernameLink = `<span style="color: blue; text-decoration: none;">${comment.username}</span>`;

                commentElement.innerHTML = `
                    <p><strong>${usernameLink}</strong>: ${comment.comment_text}</p>
                `;
                commentsContainer.appendChild(commentElement);
            });
        } else {
            console.error("Failed to load comments");
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}



  // Load comments when the page is ready
  loadComments();
});
