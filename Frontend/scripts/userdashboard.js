document.addEventListener('DOMContentLoaded', async () => {
    
  async function fetchStoriesByUsers() {
    try {
      const response = await fetch(`http://localhost:3005/stories/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const stories = await response.json();
      displayStories(stories.stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  }
  
  function displayStories(stories) {
   if(!Array.isArray(stories)){
    console.error('Invalid data format- Expect an array');
    return;
   }
    const tableBody = document.querySelector('.table--container tbody');
    tableBody.innerHTML = '';
    const dateFormatter = new Intl.DateTimeFormat('en-US', {day: 'numeric', month: 'short', year : 'numeric'})

    stories.forEach(story => {
      const row = document.createElement('tr');
      const createdAt = new Date(story.created_at);
      const formattedDate = dateFormatter.format(createdAt);
      row.innerHTML = ` 
        <td>${formattedDate}</td>
        <td>${story.title}</td>
        <td>${story.content}</td>
        <td>${story.author}</td>
        <td></td> <!-- Fill this column with status data -->
        <td>
          <div class="dropdown">
            <button class="dropbtn">Action</button>
            <div class="dropdown-content">
              <a href="#" class="delete">Delete</a>
              <a href="#" class="edit">Edit</a>
              <a href="#" class="publish">Publish</a>
              <a href="#" class="publish">Publish For Collaborative</a>
            </div>
          </div>
        </td>`;
      tableBody.appendChild(row);
    });

    const totalCompleted = document.querySelector('tfoot tr td:nth-child(1)');
    totalCompleted.textContent = `Total Stories: ${stories.lenght} `;
  }

  fetchStoriesByUsers();
});

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
        const response = await fetch('http://localhost:3005/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: reqData,
        });

        if (response.ok) {
            const data = await response.json();
            const { token, username: loggedInUsername , user_id } = data;
            

            localStorage.setItem('token', token);
            localStorage.setItem('loggedInUsername', loggedInUsername)
            localStorage.setItem('user_id', user_id)
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
  console.log(stories)
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

document.addEventListener('DOMContentLoaded', () => {
  const loggedInUsername = localStorage.getItem('loggedInUsername');
  if (loggedInUsername) {
    const stories = fetchStoriesByUser(loggedInUsername);
    console.log('Fetched stories:', stories); // Logging the fetched stories
  } else {
    console.error('No logged-in user found');
  }
});

fetchStoriesByUser();
displayStories();

document.addEventListener('DOMContentLoaded', () => {

  const loggedInUsername = localStorage.getItem('loggedInUsername');
  
  if (loggedInUsername) {
    fetchStoriesByUser(loggedInUsername);
  } else {
    console.error('No logged-in user found');
  }

});




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

