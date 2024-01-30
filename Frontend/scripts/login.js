document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginform");
  const popup = document.getElementById('popup');

  function showPopup() {
    popup.classList.toggle('show');

    setTimeout(() => {
      popup.classList.remove('show')
    }, 1000);
  }
  async function loginUser(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const passwordInput = document.getElementById("password"); 

    const password = passwordInput.value;

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
        localStorage.setItem("userId", user_id);

        window.location = "userdashboard.html";
      } else {
       showPopup()  
        passwordInput.value = '';
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }
});
