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
      const adminRole = document.getElementById('adminRole');

      const role = userRole.checked ? userRole.value : adminRole.value;

      // Check if admin role is selected
      if (role === 'admin') {
          const secretKey = prompt('Please enter your Secret Key:');
          if (secretKey !== 'TOPSECRET') {
              alert('Invalid Secret Key. Please Try Again');
              return;
          }
      }

      const reqData = JSON.stringify({ fullname, username, password, role });

      try {
          const response = await fetch('http://localhost:3002/auth/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: reqData
          });

          if (response.ok) {
              window.location.href = './login.html';
          } else {
              const data = await response.json();
              console.log('Error:', data.message);
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
            window.location.href = `./userdashboard.html?username=${loggedInUsername}`;
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



  function logoutUser() {
    console.log('log out function called')
      localStorage.removeItem('token');
      window.location.href = './login.html';
  }
displayLoggedInUsername();

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
