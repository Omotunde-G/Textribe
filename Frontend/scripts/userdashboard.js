document.addEventListener("DOMContentLoaded", async () => {
  const authorId = localStorage.getItem("userId");

  // Fetch and display the author's stories
  async function fetchStoriesByUser() {
    try {
      const response = await fetch(
        `http://localhost:3005/stories/${authorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stories");
      }

      const data = await response.json();
      displayStories(data.stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  }

  // Display stories in the table
  function displayStories(stories) {
    const storiesTableBody = document.getElementById("storiesTableBody");
    storiesTableBody.innerHTML = ""; // Clear existing rows

    stories.forEach((story) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${new Date(story.created_at).toLocaleDateString()}</td>
        <td>
          <a href="fullstory.html?story_id=${
            story.story_id
          }" style="color: Green; text-decoration: none;">${story.title}</a>
          
        </td>
        <td>${getFirst50Words(story.content)}</td>
        <td>Published</td>
        <td>
          <button style="color: red;" onclick="window.deleteStory(${
            story.story_id
          }, this)">Delete</button>
        </td>
      `;

      storiesTableBody.appendChild(row);
    });
  }

  // Fetch and display the contributions
  async function fetchContributions() {
    try {
      const response = await fetch(
        `http://localhost:3005/collaboration/author/${authorId}/contributions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch contributions");

      const data = await response.json();
      displayContributions(data.contributions);
      console.log(data);
    } catch (error) {
      console.error("Error fetching contributions:", error);
    }
  }

  // Helper function to get the first 50 words of a text
  function getFirst50Words(text) {
    return text.split(/\s+/).slice(0, 50).join(" ") + "...";
  }

  // Accept contribution
  window.acceptContribution = async function (contributionId) {
    try {
      // Step 1: Accept the contribution and merge it into the original story
      const response = await fetch(
        `http://localhost:3005/collaboration/contributions/${contributionId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Updated Story Content:", data.updatedContent);

        alert("Contribution accepted and merged into the original story!");
        closeModal(); // Close modal after accepting
        fetchContributions(); // Refresh contributions

        // Fetch and display the updated story content
        const storyId = data.story_id; // Make sure story_id is included in the backend response
        if (storyId) {
          const updatedStoryResponse = await fetch(
            `http://localhost:3005/stories/${storyId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (updatedStoryResponse.ok) {
            const updatedStory = await updatedStoryResponse.json();
            console.log("Updated Story:", updatedStory);
          } else {
            console.error("Failed to fetch the updated story content");
          }
        } else {
          console.error(
            "Story ID is undefined. Cannot fetch the updated story."
          );
        }
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error accepting contribution:", error);
    }
  };

  // Decline contribution
  window.declineContribution = async function (contributionId) {
    try {
      const response = await fetch(
        `http://localhost:3005/collaboration/contributions/${contributionId}/decline`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        alert("Contribution declined!");
        closeModal(); // Close modal after declining
        fetchContributions(); // Refresh the contributions list
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error declining contribution:", error);
    }
  };

  // Send feedback on a contribution
  window.sendFeedback = async function (contributionId) {
    console.log("Contribution ID:", contributionId); // showing id on the log

    const feedbackText = prompt("Enter your feedback:");

    if (feedbackText) {
      try {
        const response = await fetch(
          `http://localhost:3005/collaboration/contributions/${contributionId}/feedback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ feedbackText }),
          }
        );

        if (response.ok) {
          alert("Feedback sent!");
          closeModal(); // Close modal after feedback is sent
          fetchContributions();
        } else {
          console.error("Response Status:", response.status); // Debugging line
          const errorData = await response.json();
          console.error("Error Data:", errorData.message); // Debugging line
        }
      } catch (error) {
        console.error("Error sending feedback:", error);
      }
    }
  };

  // Delete story
  window.deleteStory = async function (storyId, button) {
    // Ask for confirmation before deleting the story
    const confirmation = window.confirm(
      "Are you sure you want to delete this story? This action cannot be undone."
    );

    if (!confirmation) {
      // If the user cancels, do nothing
      return;
    }

    try {
      const response = await fetch(`http://localhost:3005/stories/${storyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        button.closest("tr").remove();
        alert("Story deleted");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  //contribution table
  function displayContributions(contributions) {
    const contributionsTableBody = document.getElementById(
      "contributionsTableBody"
    );
    contributionsTableBody.innerHTML = ""; // Clear existing rows

    const modal = document.getElementById("contributionModal");
    const modalContributorName = document.getElementById(
      "modalContributorName"
    );
    const modalContributionContent = document.getElementById(
      "modalContributionContent"
    );
    const closeModal = document.getElementById("closeModal");
    const modalAcceptBtn = document.getElementById("modalAcceptBtn");
    const modalDeclineBtn = document.getElementById("modalDeclineBtn");
    const modalFeedbackBtn = document.getElementById("modalFeedbackBtn");

    contributions.forEach((contribution) => {
      const row = document.createElement("tr");

      // Create a clickable link for the contribution content
      row.innerHTML = `
        <td>${contribution.contributor_name}</td>
        <td>
          <a href="javascript:void(0);" style="color: Green; text-decoration: none;" class="open-modal-link" data-contribution-id="${
            contribution.id
          }">
            ${getFirst50Words(contribution.contribution_text)}
          </a>
        </td>
        <td>
          <button onclick="window.acceptContribution(${
            contribution.id
          })">Accept</button>
          <button onclick="window.declineContribution(${
            contribution.id
          })">Decline</button>
          <button onclick="window.sendFeedback(${
            contribution.id
          })">Feedback</button>
        </td>
      `;

      contributionsTableBody.appendChild(row);
    });

    // Add event listener for contribution links
    document.querySelectorAll(".open-modal-link").forEach((link) => {
      link.addEventListener("click", function () {
        const contributionId = this.getAttribute("data-contribution-id");

        // Find the corresponding contribution by its ID
        const contribution = contributions.find(
          (c) => c.id === parseInt(contributionId)
        );

        if (contribution) {
          // Populate modal content
          modalContributorName.textContent = contribution.contributor_name;
          modalContributionContent.textContent = contribution.contribution_text;

          // Set up the modal action buttons
          modalAcceptBtn.onclick = () =>
            window.acceptContribution(contribution.id);
          modalDeclineBtn.onclick = () =>
            window.declineContribution(contribution.id);
          modalFeedbackBtn.onclick = () => window.sendFeedback(contribution.id);

          // Display the modal
          modal.style.display = "block";
        }
      });
    });

  //   document.addEventListener("DOMContentLoaded", async () => {
  //     const userId = localStorage.getItem("userId");
  
  //     // Fetch and display feedback for the user
  //     async function fetchUserFeedback() {
  //         try {
  //             const response = await fetch(`http://localhost:3005/users/${userId}/feedback`, {
  //                 headers: {
  //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //                 }
  //             });
  
  //             if (response.ok) {
  //                 const data = await response.json();
  //                 displayFeedback(data.feedbacks);
  //             } else {
  //                 throw new Error('Failed to fetch feedback');
  //             }
  //         } catch (error) {
  //             console.error("Error fetching feedback:", error);
  //         }
  //     }
  
  //     function displayFeedback(feedbacks) {
  //         const feedbackTableBody = document.getElementById("feedbackTableBody");
  //         feedbackTableBody.innerHTML = ""; // Clear existing rows
  
  //         feedbacks.forEach((feedback) => {
  //             const row = document.createElement("tr");
  //             row.innerHTML = `
  //                 <td>${feedback.storyTitle}</td>
  //                 <td>${feedback.feedback}</td>
  //             `;
  //             feedbackTableBody.appendChild(row);
  //         });
  //     }
  
  //     // Fetch feedback on page load
  //     await fetchUserFeedback();
  // });
  

    // Close modal when "X" is clicked
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Close modal when user clicks outside of it
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  // Display logged-in username
  function displayLoggedInUsername() {
    const loggedInUsername = localStorage.getItem("loggedInUsername");
    const usernameDisplayElement = document.querySelector("#usernameDisplay");
    if (usernameDisplayElement) {
      usernameDisplayElement.textContent = loggedInUsername || "Guest";
    }
  }

  // Function to logout user
  function logoutUser() {
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  }

  // Initialize page
  displayLoggedInUsername();
  await fetchStoriesByUser();
  await fetchContributions();

  // Event listener for logout button
  const logoutButton = document.querySelector(".logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
  }
});
