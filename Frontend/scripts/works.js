document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.querySelector('form');
  const loginForm = document.getElementById('loginform');
  const logoutButton = document.querySelector('.logout');
  const newProjectButton = document.getElementById('newproject');
  const cardContainer = document.getElementById('card--container') 
  const createStory = document.getElementById('createstory')
  const CancelPost = document.getElementById('cancelPost')
  const saveStory = document.getElementById('savestory')

   createStory.style.display='none'
   newProjectButton.addEventListener('click',() =>{
   createStory.style.display = 'block'
   })
   CancelPost.addEventListener('click', ()=>{
    createStory.style.display = 'none'
   })
   
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
        localStorage.setItem('user_id', user_id)

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
  function displayLoggedInUsername() {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const usernameDisplayElement = document.querySelectorAll('#usernameDisplay');

    usernameDisplayElement.forEach(element => {
      element.textContent = loggedInUsername || 'Guest';
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

  newProjectButton.addEventListener('click', () =>{
   })
// Function to show the new post form
function showNewPostForm() {
   formHtml.appendChild('createStory')
 
  // Add the form to the page
cardContainer.innerHTML += formHtml;

  // Event listener for the "Create Post" button
  document.getElementById('submitPost').addEventListener('click', () => {
      // Handle the submission of the new post form
      submitNewPost();
});

CancelPost.addEventListener('click', () =>{
  
  createstory.style.display = 'none';
})

}



// Function to handle the submission of the new post form
async function submitNewPost() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const story = document.getElementById('story').value;
  const user_id = localStorage.getItem('user_id')

  const data = { user_id, title, author, content: story }
  const useridentity = localStorage.userId
  try {
      const response = await fetch(`https://textribe.onrender.com/stories/create/${useridentity}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Story Succesfully Posted');
          console.log('Story created successfully');
          document.getElementById('title').value = '';
          document.getElementById('author').value = '';
          document.getElementById('story').value = '';
      } else {
          alert('failed')
          console.error('Failed to create story');
      }
  } catch (error) {
      console.error('Error submitting post:', error);
  }
       
}



  // Function to fetch stories by the logged-in user
  async function fetchStoriesByUser(author) {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    try {
      const response = await fetch(`https://textribe.onrender.com/stories/${loggedInUsername}`);
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

})
