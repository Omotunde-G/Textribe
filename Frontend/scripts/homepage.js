document.addEventListener("DOMContentLoaded", async () => {
  const bookContainer = document.getElementById("bookContainer");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementById("closeBtn");
  const editBtn = document.getElementById("editBtn");
  const exitBtn = document.getElementById("exitBtn");
  const modal = document.getElementById("modal");
  const textareaContainer = document.getElementById("textareaContainer");
  const cardContainer = document.getElementById("card-container");


  let editorInstance = null;

  // Close modal event listener
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Display story content in modal
  function displayStoryContent(story) {
    modalContent.innerHTML = `
      <h2>${story.title}</h2>
      <h4>Author: ${story.author}</h4>
      <p>${story.content}</p>
    `;
    modal.style.display = "block";
  }

  // Event listener for "Contribute" button

  // Event listener for Clear button
clearBtn.addEventListener('click', () => {
  if (editorInstance) {
      editorInstance.html.set('');
      const textarea = textareaContainer.querySelector("textarea");
      if (textarea) {
          textarea.value = "";
      }
  }
});


  // Event listener for "Exit" button
  exitBtn.addEventListener("click", () => {
    const textarea = textareaContainer.querySelector("textarea");
    if (textarea) {
   
      modal.style.display = "none"
    }
    
    modal.style.display = "none";
  });

  try {
    const response = await fetch("http://localhost:3005/stories/all");
    if (response.ok) {
      const data = await response.json();
      if (data && data.stories && Array.isArray(data.stories)) {
        displayStories(data.stories, modalContent);
      } else {
        throw new Error("Invalid data format");
      }
    } else {
      throw new Error("Failed to fetch stories");
    }
  } catch (error) {
    console.error("Error fetching stories:", error);
    // Handle the error - display a message or perform other actions
  }

  // Function to display fetched stories as cards
  function displayStories(data) {
    if (Array.isArray(data)) {
      data.forEach((story) => {
        const storyCard = document.createElement("div");
        storyCard.classList.add("card");
        storyCard.innerHTML = `
        <img src="/Frontend/images/story.jpeg" alt="Story Image">
        <div class="card-content">
          <h3>${story.title}</h3>
          <p>Author: ${story.author}</p>
          <a href="#" class="btn read-more">Read More</a>
        </div>
      `;
        cardContainer.appendChild(storyCard);

        // Read more button click event
        const readMoreBtn = storyCard.querySelector(".read-more");
        readMoreBtn.addEventListener("click", () => displayStoryContent(story));
      });
    } else {
      console.error("Invalid data format received:", data);
    }
  }

  const logoutButton = document.querySelector(".logout");
  function logoutUser() {
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  }
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
  }
});
