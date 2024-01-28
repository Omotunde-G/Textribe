document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginform");
  const logoutButton = document.querySelector(".logout");
  const newProjectButton = document.getElementById("newproject");
  const editorDiv = document.getElementById("editor");

  // login
  async function loginUser(e) {
    e.preventDefault();
    //   window.location = "userdashboard.html";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const reqData = JSON.stringify({ username, password });

    try {
      const response = await fetch("http://localhost:3005/auth/login", {
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

        // Display logged-in username in the UI (usernameDisplay is an element)
        const usernameDisplay = document.getElementById("usernameDisplay");

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

  const params = new URLSearchParams(window.location.search);
  const loggedInUsername = params.get("username");

  // Set the username in the HTML
  const usernameDisplay = document.getElementById("usernameDisplay");
  if (usernameDisplay) {
    usernameDisplay.textContent = loggedInUsername || "Guest";
  }
  function displayLoggedInUsername() {
    const loggedInUsername = localStorage.getItem("loggedInUsername");
    const usernameDisplayElement =
      document.querySelectorAll("#usernameDisplay");

    usernameDisplayElement.forEach((element) => {
      element.textContent = loggedInUsername || "Guest";
    });
  }

  function logoutUser() {
    console.log("log out function called");
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  }

  displayLoggedInUsername();
  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
  }

  newProjectButton.addEventListener("click", () => {
    showNewPostForm();
  });
  // Function to show the new post form
  function showNewPostForm() {
    // You can customize the form appearance as needed
    const formHtml = `
  <div id="createstory" >
  <h2 style="color=#7163FF; margin-bottom: 10px; font-size: 1.5em";>Create New Post</h2>
  <form id="newPostForm" style="margin-bottom: 20px;">
      <label for="title" style="display: block; margin-bottom: 5px;">Title:</label>
      <input type="text" id="title" required style="border: 1px solid black; padding: 5px; width: 100%;"><br>
  
      <label for="author" style="display: block; margin-top: 10px; margin-bottom: 5px;">Author:</label>
      <input type="text" id="author" required style="border: 1px solid black; padding: 5px; width: 100%;"><br>
  
      <label for="story" style="display: block; margin-top: 10px; margin-bottom: 5px;">Story:</label>
      <textarea id="story" rows="5" required style="border: 1px solid black; padding: 5px; width: 100%;"></textarea><br>
  
      <button type="button" id="submitPost" style="background-color:  rgb(156, 88, 156); color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer;">Create Post</button>
      <button type="button" id="cancelPost" style="background-color:  rgb(156, 88, 156); color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer;">Cancel </button>
  </form>
  </div>
  
  `;


    // Event listener for the "Create Post" button
    document.getElementById("submitPost").addEventListener("click", () => {
      // Handle the submission of the new post form
      submitNewPost();
    });
    const CancelPost = document.getElementById("cancelPost");
    CancelPost.addEventListener("click", () => {
      createstory.style.display = "none";
    });
  }

  // Function to handle the submission of the new post form
  async function submitNewPost() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const story = document.getElementById("story").value;

    const data = { title, author, content: story };
    try {
      const response = await fetch(`http://localhost:3005/stories/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Story Succesfully Posted");
        console.log("Story created successfully");
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("story").value = "";
      } else {
        alert("failed");
        console.error("Failed to create story");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  }
})