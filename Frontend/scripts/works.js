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
              const { token, username: loggedInUsername , user_id} = data;
  
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

  
// Function to fetch stories by the logged-in user
async function fetchStoriesByUser(author) {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    try {
      const response = await fetch(`http://localhost:3002/stories/${loggedInUsername}`);
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

    const newProjectLink = document.getElementById('newproject');
    newProjectLink.addEventListener('click', function(event) {
        const button = document.createElement('button');
        
        document.body.appendChild(button)
    })
   
    newProjectLink.addEventListener('click', function(event) {
        event.preventDefault();
       

        // Open the Froala Editor when the "New Project" link is clicked
        const editor = new FroalaEditor('#editor', {
            toolbarButtons: {
                moreText: {
                    buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript'],
                    buttonsVisible: 3
                },
                moreParagraph: {
                    buttons: ['alignLeft', 'alignCenter', 'formatOLSimple', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'fullscreen'],
                    buttonsVisible: 8
                }
               
            },
            events: {
                'initialized': function() {
                    const froalaInstance = this;

            const saveButton = { 
                title: 'Save',
                icon: 'fa fa-save',
                callback: function() {
                    const content = froalaInstance.html.get();
                    saveContentToDatabase(content); 

   
                }
            };
            froalaInstance.toolbar.addButton('saveButton', saveButton);
        }
    }
})
    })
})
        