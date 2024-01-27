document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector("form");

  async function registerUser(e) {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email");
    const userRole = document.getElementById("userRole");

    const role = userRole; // Assuming you're properly getting the role
    const reqData = JSON.stringify({
      fullname,
      username,
      email,
      password,
      role,
    });

    try {
      const response = await fetch(
        "https://textribe.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: reqData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { user_id } = data; // Capture the user_id from the response

        // Save both username and user_id in local storage
        localStorage.setItem("loggedInUsername", username);
        localStorage.setItem("userId", user_id);

        window.location.href = "/Frontend/pages/login.html"; // Redirect to profile settings
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (signupForm) {
    signupForm.addEventListener("submit", registerUser);
  }
});
