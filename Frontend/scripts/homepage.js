document.addEventListener("DOMContentLoaded", async () => {
  // Get references to all necessary DOM elements
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementById("closeBtn");
  const editBtn = document.getElementById("editBtn");
  const bookContainer = document.getElementById("bookContainer");
  const exitBtn = document.getElementById("exitBtn");
  const contributeBtn = document.getElementById("contributeBtn");

  let storyId = null; 
    const authorId = localStorage.getItem("userId");

  const userId = localStorage.getItem("userId")
  console.log(userId)
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. User might not be authenticated.");
    return;
  }

  // Event listener for the contribute button
  if (contributeBtn) {
    contributeBtn.addEventListener("click", () => {
      const storyContent = editBtn.dataset.storyContent;

      // Store the story content in localStorage
      localStorage.setItem("currentStory", storyContent);

      // Redirect to fullstory.html
      window.location.href = "fullstory.html";
    });
  } else {
    console.error("contributeBtn is not defined or not found in the DOM");
  }

  // Function to close the modal
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Event listener for the like button
const likeBtn = document.getElementById("likeBtn");
if (likeBtn) {
    likeBtn.addEventListener("click", async () => {
        if (!storyId) {
            console.error("storyId is not defined");
            return;
        }

        console.log("Liked");

        try {
            const response = await fetch(
                `http://localhost:3005/stories/${storyId}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.ok) {
                const data =
                    response.headers.get("content-length") > 0
                        ? await response.json()
                        : null;
                if (data) alert(data.message);
            } else {
                const errorData =
                    response.headers.get("content-length") > 0
                        ? await response.json()
                        : null;
                if (errorData) alert(errorData.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
} else {
    console.error("likeBtn is not defined or not found in the DOM");
}


  // Function to display the story content in the modal
  function displayStoryContent(story) {
    modalContent.innerHTML = `
      <h2>${story.title}</h2>
      <h4>Author: ${story.author}</h4>
      <p>${story.content.substring(0, 800)}..... <b id="readFullStory">Read Full Story</b></p>
    `;

    storyId = story.story_id; // Set storyId here
    localStorage.setItem("storyId", storyId);

    const fullStoryContent = `
      <h2>${story.title}</h2>
      <h4>Author: ${story.author}</h4>
      <p>${story.content}</p>
    `;
    localStorage.setItem("currentStory", fullStoryContent);

    // Store the full story content in the edit button's dataset if needed
    editBtn.dataset.storyContent = fullStoryContent;

    // Show the modal
    modal.style.display = "block";

    // Add event listener to "Read Full Story" link inside the modal
    const readFullStoryLink = document.getElementById("editBtn");
    if (readFullStoryLink) {
      readFullStoryLink.addEventListener("click", () => {
        // Redirect to fullstory.html
        window.location.href = "fullstory.html";
      });
    }
  }

  // Fetch and display stories
  try {
    const response = await fetch("http://localhost:3005/stories/all");
    if (response.ok) {
      const data = await response.json();
      if (data && data.stories && Array.isArray(data.stories)) {
        data.stories.forEach((story) => {
          const storyCard = document.createElement("div");
          storyCard.classList.add("card");
          storyCard.innerHTML = `
            <img src=${story.images} alt="Story Image">
            <div class="card-content">
              <h3>${story.title}</h3>
              <p>Author: ${story.author}</p>
              <a href="#" class="btn read-more">Read More</a>
              <p>Likes: <span class="like-count">${story.likeCount}</span></p>
            </div>
          `;
          bookContainer.appendChild(storyCard);

          const readMoreBtn = storyCard.querySelector(".read-more");
          if (readMoreBtn) {
            readMoreBtn.addEventListener("click", () =>
              displayStoryContent(story)
            );
          }
        });
      } else {
        throw new Error("Invalid data format");
      }
    } else {
      throw new Error("Failed to fetch stories");
    }
  } catch (error) {
    console.error("Error fetching stories:", error);
  }


const logoutButton = document.querySelector(".logout");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  });
} else {
  console.error("Logout button not found.");
}
// my story 

  // Fetch and display "My Stories"
  async function fetchMyStories() {
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


  // Display My Stories in the DOM
  function displayMyStories(stories) {
    const myStoriesContainer = document.getElementById("myStoriesContainer");
    myStoriesContainer.innerHTML = ""; // Clear previous stories

    stories.forEach((story) => {
      const storyCard = document.createElement("div");
      storyCard.classList.add("card");
      storyCard.innerHTML = `
        <img src=${story.images} alt="Story Image">
        <div class="card-content">
          <h3>${story.title}</h3>
          <p>Author: ${story.author}</p>
          <a href="fullstory.html?story_id=${story.story_id}" class="btn read-more">Read More</a>
          <p>Likes: <span class="like-count">${story.likeCount}</span></p>
        </div>
      `;
      myStoriesContainer.appendChild(storyCard);
    });
  }

  // Fetch "My Stories" for the logged-in user
  await fetchMyStories();


});