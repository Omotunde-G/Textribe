document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginform");
  
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
          const { token, username: loggedInUsername, user_id } = data; // Retrieve userId from the response
  
          // Save the token, username, and userId in local storage
          localStorage.setItem("token", token);
          localStorage.setItem("loggedInUsername", loggedInUsername);
          localStorage.setItem("userId", user_id); // Store the user ID
  
          // Redirect to the user dashboard or profile page
          window.location = "userdashboard.html";
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    if (loginForm) {
      loginForm.addEventListener("submit", loginUser);
    }
  });
  