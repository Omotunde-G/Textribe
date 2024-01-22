document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginform');
    const logoutButton = document.querySelector('.logout');
  
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
          const { token, username: loggedInUsername, user_id } = data;
  
          localStorage.setItem('token', token);
          localStorage.setItem('loggedInUsername', loggedInUsername);
          localStorage.setItem('user_id', user_id);
  
          window.location = "userdashboard.html";
        } else {
          const errorData = await response.json();
          console.error('Error:', errorData.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    function displayLoggedInUsername() {
      const loggedInUsername = localStorage.getItem('loggedInUsername');
      const usernameDisplayElements = document.querySelectorAll('#usernameDisplay');
  
      usernameDisplayElements.forEach(element => {
        element.textContent = loggedInUsername || 'Guest';
      });
    }
  
    function logoutUser() {
      console.log('Logout function called');
      localStorage.removeItem('token');
      window.location.href = './login.html';
    }
  
    displayLoggedInUsername();
  
    if (loginForm) {
      loginForm.addEventListener('submit', loginUser);
    }
  
    if (logoutButton) {
      logoutButton.addEventListener('click', logoutUser);
    }
  });
  
  document.addEventListener('DOMContentLoaded', async () => {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
   
    if(loggedInUsername) {
      
        try {
         
            const response = await fetch(`http://localhost:3005/users/userProfile/${loggedInUsername}`);
            if (response.ok) {
                const userData = await response.json();
                console.log(userData)
                displayUserProfile(userData[0])
                
            } 
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
     }
        
});
function displayUserProfile(userData){
    const FullnameElem = document.getElementById('fullname');
    const BioElem = document.getElementById('bio')
    const locationElem = document.getElementById('location');
    const numOfStoriesElem = document.getElementById('number_of_stories');
    const usernameElem = document.getElementById('usernameDisplay'); 
    const loggedInUsername = localStorage.getItem('loggedInUsername');

  
    fullnameElem.innerHTML = userData.fullname || 'No Data';
    bioElem.innerHTML = userData.bio || 'No Data';
    locationElem.textContent = `Lives in ${userData.location || 'Unknown Location'}`;
    numOfStoriesElem.textContent = `${userData.number_of_stories || 0} Stories Written`;
    usernameElem.textContent = loggedInUsername || 'Guest';
    
  }
  
  