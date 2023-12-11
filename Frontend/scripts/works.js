// const token = localStorage.getItem("token")
// if(token){
//     window.location = "homepage.html"
//     }

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('form');
    const loginForm = document.getElementById('loginform');
    const logoutButton = document.querySelector('.logout');
   
  
  
    // login 
    async function loginUser(e) {
      e.preventDefault();
    //   window.location = "userdashboard.html";

  
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
    
  
      const reqData = JSON.stringify({ username, password });
  
      try {
          const response = await fetch('http://localhost:3002/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: reqData,
          });
  
          if (response.ok) {
              const data = await response.json();
              const { token, username: loggedInUsername } = data;
  
              localStorage.setItem('token', token);
              localStorage.setItem('loggedInUsername', loggedInUsername)
  
              // Display logged-in username in the UI (usernameDisplay is an element)
              const usernameDisplay = document.getElementById('usernameDisplay');
  
              // Redirect to the user dashboard
              window.location = "userdashboard.html";
          } else {
              const errorData = await response.json()
              console.error('Error:', errorData.message);
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }
  
    const params = new URLSearchParams(window.location.search);
    const loggedInUsername = params.get('username');
    
    // Set the username in the HTML
    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) {
        usernameDisplay.textContent = loggedInUsername || 'Guest';
    }
    function displayLoggedInUsername(){
      const loggedInUsername = localStorage.getItem('loggedInUsername');
      const usernameDisplayElement = document.querySelectorAll('#usernameDisplay');
  
      usernameDisplayElement.forEach(element =>{
        element.textContent =loggedInUsername || 'Guest';
      })
    }
  
    function checkLoginStatus(){
      const loggedInUsername = localStorage.getItem('loggedInUsername');
      const currentPage = window.location.pathname.slice('/').pop();
  
      if(!loggedInUsername) {
        window.location.href = `./login.html`;
     
      } else if (loggedInUsername && currentPage !== 'homepage.html'){
        window.location.href = `./homepage.html?username=${loggedInUsername}`;
      }
    }
  
    function logoutUser() {
      console.log('log out function called')
        localStorage.removeItem('token');
        window.location.href = './login.html';
    }
   
    displayLoggedInUsername();
    // checkLoginStatus();
  
  
    if (signupForm) {
        signupForm.addEventListener('submit', registerUser);
    }
  
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }
  
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
  });
  