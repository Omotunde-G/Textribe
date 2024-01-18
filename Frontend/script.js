document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('form');
    const loginForm = document.getElementById('loginform');
    const logoutButton = document.querySelector('.logout');
    async function registerUser(e) {
        e.preventDefault();
    
        const fullname = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const userRole = document.getElementById('userRole');
    
        const role = userRole; // Assuming you're properly getting the role
        const reqData = JSON.stringify({ fullname, username, password, role });
    
        try {
            const response = await fetch('http://localhost:3005/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: reqData
            });
    
            if (response.ok) {
                const data = await response.json();
                const { user_id } = data; // Capture the user_id from the response
    
                // Save both username and user_id in local storage
                localStorage.setItem('loggedInUsername', username);
                localStorage.setItem('userId', user_id);
    
                window.location.href = '/Frontend/pages/login.html'; // Redirect to profile settings
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
  
    // login 
    async function loginUser(e) {
        e.preventDefault();
    
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        const reqData = JSON.stringify({ username, password });
    
        try {
            const response = await fetch('http://localhost:3005/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: reqData,
            });
    
            if (response.ok) {
                const data = await response.json();
                const { token, username: loggedInUsername, user_id } = data; // Retrieve userId from the response
    
                // Save the token, username, and userId in local storage
                localStorage.setItem('token', token);
                localStorage.setItem('loggedInUsername', loggedInUsername);
                localStorage.setItem('userId', user_id); // Store the user ID
    
                // Redirect to the user dashboard or profile page
                window.location = "userdashboard.html";
            } else {
                const errorData = await response.json();
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
        localStorage.removeItem('userId');
        localStorage.removeItem('loggedInUsername');
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
  