
document.addEventListener('DOMContentLoaded', () => {  
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
          const response = await fetch('https://textribe.onrender.com/auth/login', {
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
              localStorage.setItem('loggedInUsername', loggedInUsername)
              localStorage.setItem('user_id', user_id);
  
              
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
  
    function logoutUser() {
      console.log('log out function called')
        localStorage.removeItem('token');
        window.location.href = './login.html';
    }
   
    displayLoggedInUsername();
    // checkLoginStatus();

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }
  
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

  });
  document.addEventListener('DOMContentLoaded', async() => {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
   
    if(loggedInUsername) {
      
        try {
         
            const response = await fetch(`https://textribe.onrender.com/users/userProfile/${loggedInUsername}`);
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
    const numOfStories = document.getElementById('number_of_stories')

    FullnameElem.innerHTML = userData.fullname;
    BioElem.innerHTML = userData.bio;
    locationElem.textContent = "Lives in " + userData.location;
    numOfStories.textContent = userData.number_of_stories + " Stories Written";
}

