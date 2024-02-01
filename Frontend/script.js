document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector("form");

  async function registerUser(e) {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const userRole = document.getElementById("userRole");
    const profileImage = document.getElementById("profile_image");
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", profileImage.files[0]);

    const role = userRole; // Assuming you're properly getting the role

    try {
      const response = await fetch(
        "https://textribe.onrender.com/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(response);

      if (response.ok) {
        const reqData = await response.json();
        const { user_id, profile_image: profileImageUrl } = reqData; 

       
        localStorage.setItem("loggedInUsername", username);
        localStorage.setItem("userId", user_id);
        localStorage.setItem("profileImageUrl", profileImageUrl);
        console.log(localStorage);

        // window.location.href = "/Frontend/pages/login.html"; // Redirect to profile settings
        window.location.href ="/Frontend/pages/homepage.html"
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
