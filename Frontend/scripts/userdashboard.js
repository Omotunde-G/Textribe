document.addEventListener("DOMContentLoaded", async () => {
  async function fetchStoriesByUser() {
    console.log(localStorage.getItem("userId"));
    const user_id = localStorage.getItem("userId");

    try {
      const response = await fetch(
        `https://textribe.onrender.com/stories/${user_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stories");
      }
      const stories = await response.json();
      const extractedStoryIds = stories.stories.map((story) => story.story_id);
      displayStories(stories.stories, extractedStoryIds);
      return stories;
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  }

  function displayStories(stories, extractedStoryIds) {
    const storiesTableBody = document.getElementById("storiesTableBody");

    if (!Array.isArray(stories) || stories.length === 0) {
      console.error("Invalid data format or empty stories array");
      return;
    }

    // Clear existing rows
    storiesTableBody.innerHTML = "";

    // Iterate through each story and create a table row for it
    stories.forEach((story, index) => {
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = new Date(story.created_at).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      row.appendChild(dateCell);

      const titleCell = document.createElement("td");
      titleCell.textContent = story.title;
      row.appendChild(titleCell);

      const storyCell = document.createElement("td");
const contentPreview = getFirst50Words(story.content);
storyCell.textContent = contentPreview;
row.appendChild(storyCell);

function getFirst50Words(text) {

    const words = text.split(/\s+/);
    const preview = words.slice(0, 50).join(" ");

    return preview;
}

      const statusCell = document.createElement("td");
      statusCell.textContent = "Published";
      row.appendChild(statusCell);

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.color="red"
      const storyId = extractedStoryIds[index];

      deleteButton.addEventListener("click", () => {
  
        deleteStory(storyId, row);
      });

      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);



      storiesTableBody.appendChild(row);
    });

    // Log stories in the console
    console.log("Received stories:", stories);
  }


  async function deleteStory(storyId, row) {
    try {
      const response = await fetch(`https://textribe.onrender.com/stories/${storyId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        row.remove();
        alert('Story Deleted')
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
  // Fetch and display stories on page load
  const loggedInUsername = localStorage.getItem("loggedInUsername");
  

  if (loggedInUsername) {
    await fetchStoriesByUser(loggedInUsername);
  } else {
    console.error("No logged-in user found");
  }

  // Event listener for logout button
  const logoutButton = document.querySelector(".logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
  }
  
  // Function to logout user
  function logoutUser() {
    console.log("log out function called");
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  }

  // Function to display logged-in username
  function displayLoggedInUsername() {
    const loggedInUsername = localStorage.getItem("loggedInUsername");
    const usernameDisplayElement =
      document.querySelectorAll("#usernameDisplay");

    usernameDisplayElement.forEach((element) => {
      element.textContent = loggedInUsername || "Guest";
    });
  }

  // Event listener for form submission
  const loginForm = document.getElementById("loginform");
  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }

  // Function to handle login
  async function loginUser(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const reqData = JSON.stringify({ username, password });

    try {
      const response = await fetch("https://textribe.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: reqData,
      });

      if (response.ok) {
        const data = await response.json();
        const { token, username: loggedInUsername, user_id } = data;

        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUsername", loggedInUsername);
        localStorage.setItem("user_id", user_id);
        // Redirect to the user dashboard
        window.location = "userdashboard.html";
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Display logged-in username on page load
  displayLoggedInUsername();

 

});
