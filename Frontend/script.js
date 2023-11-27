document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('form');
  
    async function registerUser(e) {
      e.preventDefault();
  
      const fullname = document.getElementById('fullname').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      const reqData = JSON.stringify({ fullname, username, password });
  
      try {
        const response =  await  fetch('http://localhost:3002/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: reqData
        })
        .then(response => {
          if (response.ok) {
            window.location.href = "./login.html"
          } else {
            return response.json().then(data => {
              console.log('Error:', data.message);
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
     async function loginUser(e) {
      e.preventDefault();
  
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      console.log(username, password);
  
      const reqData = JSON.stringify({ username, password });
  
      try {
        const response = await fetch('http://localhost:3002/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: reqData
        })
        .then(response => {
          if (response.ok) {
            alert('Login successful');
          } else {
            return response.json().then(data => {
              console.log('Error:', data.message);
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    signupForm.addEventListener('submit', registerUser);
  
    const loginForm = document.getElementById('loginform');
    loginForm.addEventListener('submit', loginUser);
  });
  