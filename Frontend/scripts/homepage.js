document.addEventListener('DOMContentLoaded', async () => {
    const bookContainer = document.getElementById('bookContainer');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.getElementById('closeBtn');
    const editBtn = document.getElementById('editBtn');
    const textareaContainer = document.getElementById('textareaContainer');
  
    // Close modal event listener
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    // Display story content in modal
    function displayStoryContent(story) {
      modalContent.innerHTML = `
        <h2>${story.title}</h2>
        <h4>Author: ${story.author}</h4>
        <p>${story.content}</p>
      `;
      modal.style.display = 'block';
    }
  
    // Open modal for editing
    editBtn.addEventListener('click', () => {
      const contentText = modalContent.querySelector('p').textContent;
      const textarea = document.createElement('textarea');
      
      textarea.value = contentText;
     
      textarea.style.width = '100%'; 
      textarea.style.height = '250px'; 
  
      textareaContainer.innerHTML = ''; 
      textareaContainer.appendChild(textarea);
    });
  
    try {
      const response = await fetch('http://localhost:3002/stories/all');

            if (response.ok) {
                            const data = await response.json();
                            if (data && data.stories && Array.isArray(data.stories)) {
                                displayStories(data.stories, modalContent);
                            } else {
                                throw new Error('Invalid data format');
                            }
                        } else {
                            throw new Error('Failed to fetch stories');
                        }
                    } catch (error) {
                        console.error('Error fetching stories:', error);
                        // Handle the error - display a message or perform other actions
                    }
            

           
        
  
    // Function to display fetched stories as cards
    function displayStories(data) {
      if (Array.isArray(data)) {
        data.forEach(story => {
          const storyCard = document.createElement('div');
          storyCard.classList.add('story-card'); // Add a class for styling
          storyCard.innerHTML = `
            <h3>Title: ${story.title}</h3>
            <h4>Author: ${story.author}</h4>
            <button class="read-more">Read More</button>
          `;
          bookContainer.appendChild(storyCard);
  
          // Read more button click event
          const readMoreBtn = storyCard.querySelector('.read-more');
          readMoreBtn.addEventListener('click', () =>
          displayStoryContent(story));
        });
      } 
       else {
        console.error('Invalid data format received:', data);
        // Handle invalid data
      }
    }
    const logoutButton =  document.querySelector('.logout')
    function logoutUser() {
      localStorage.removeItem('token');
      window.location.href = './login.html'
    }
    if(logoutButton) {
      logoutButton.addEventListener('click', logoutUser)
    }
  });