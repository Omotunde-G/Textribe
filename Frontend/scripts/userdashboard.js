document.addEventListener('DOMContentLoaded', async () => {
  // Function to fetch stories by the logged-in user
  async function fetchStoriesByUser(author) {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    try {
      const response = await fetch(`http://localhost:3005/stories/${loggedInUsername}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const stories = await response.json();
      displayStories(stories.stories);
      return stories;
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  }

  // Function to display stories in the card
  function displayStories(stories) {
    const cardTitle = document.querySelector('.payment--card.light-blue .title');
    const workType = document.querySelector('.payment--card.light-blue .work-type');

    if (!Array.isArray(stories) || stories.length === 0) {
      console.error('Invalid data format or empty stories array');
      return;
    }

    // Display only the first story's title and content in the card
    const firstStory = stories[0];
    cardTitle.textContent = firstStory.title;
    workType.textContent = firstStory.content;

    // Log stories in the console
    console.log('Received stories:', stories);
  }

  // Fetch and display stories on page load
  const loggedInUsername = localStorage.getItem('loggedInUsername');
  if (loggedInUsername) {
    await fetchStoriesByUser(loggedInUsername);
  } else {
    console.error('No logged-in user found');
  }

  // Event listener for logout button
  const logoutButton = document.querySelector('.logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
  }

  // Function to logout user
  function logoutUser() {
    console.log('log out function called');
    localStorage.removeItem('token');
    window.location.href = './login.html';
  }

  // Function to display logged-in username
  function displayLoggedInUsername() {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const usernameDisplayElement = document.querySelectorAll('#usernameDisplay');

    usernameDisplayElement.forEach((element) => {
      element.textContent = loggedInUsername || 'Guest';
    });
  }

  // Event listener for form submission
  const loginForm = document.getElementById('loginform');
  if (loginForm) {
    loginForm.addEventListener('submit', loginUser);
  }

  // Function to handle login
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
        // Redirect to the user dashboard
        window.location = "userdashboard.html";
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Display logged-in username on page load
  displayLoggedInUsername();
});
