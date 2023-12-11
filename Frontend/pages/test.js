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
  });
  

















// // script.js
// document.getElementById('createStoryForm').addEventListener('submit', async function(event) {
//     event.preventDefault();
   

//     const title = document.getElementById('title');
//     const content = document.getElementById('content');
//     const author = document.getElementById('author');
   
//     try {
//         const response = await fetch('http://localhost:3002/stories/create', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ title, content, author })
//         });

//         if (response.ok) {
//             const data = await response.json();
            
//             alert('Story created successfully!')
           
           
//         } else {
//             alert('Failed to create story');
//         }
//     } catch (error) {
//         console.error('Error creating story:', error);
//         alert('Error creating story. Please check the console for details.');
//     }
// });
// document.getElementById('fetchStoryForm').addEventListener('submit', async function(event) {
//     event.preventDefault();

//     const storyId = document.getElementById('storyId').value;
//     const response = await fetch(` http://localhost:3002/stories/${storyId}`);

//     if (response.ok) {
//         const storyData = await response.json();
//         const storyDetails = document.getElementById('storyDetails');
//         storyDetails.innerHTML = `<strong>Title:</strong> ${storyData.title}<br>
//                                   <strong>Content:</strong> ${storyData.content}<br>
//                                   <strong>Author:</strong> ${storyData.author}`;
//     } else {
//         if(!storyId){

   
//         alert('story doesnt exist');
//     } else{
//         alert('invalid id ')
//     }
//     }
//     const stories =  document.getElementById('storyId');
//     const responsetoall = await fetch (' http://localhost:3002/stories');
//     if (response.ok){
//         const storyDetails = document.getElementById('storyDetails');
//         storyDetails.innerHTML = `<strong>Title:</strong> ${storyData.title}<br>
//         <strong>Content:</strong> ${storyData.content}<br>
//         <strong>Author:</strong> ${storyData.author}`;
//     }
// });
// // fetch all 
 
// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const viewStoriesBtn = document.getElementById('viewStoriesBtn');
//         const storiesContainer = document.getElementById('storiesContainer');

//         viewStoriesBtn.addEventListener('click', async () => {
//             try {
//                 const response = await fetch('http://localhost:3002/stories/all')
//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data && data.stories && Array.isArray(data.stories)) {
//                         displayStories(data.stories, storiesContainer);
//                     } else {
//                         throw new Error('Invalid data format');
//                     }
//                 } else {
//                     throw new Error('Failed to fetch stories');
//                 }
//             } catch (error) {
//                 console.error('Error fetching stories:', error);
//                 // Handle the error - display a message or perform other actions
//             }
//         });
//     } catch (error) {
//         console.error('Error in DOMContentLoaded event:', error);
//     }
// });

// function displayStories(stories, container) {
//     container.innerHTML = ""; // Clear previous content

//     stories.forEach(story => {
//         const storyDiv = document.createElement('div');
//         storyDiv.innerHTML = `
//             <h3>${story.title}</h3>
//             <p>${story.content}</p>
//             <p>Author: ${story.author}</p>
//             <hr>
//         `;
//         container.appendChild(storyDiv);
//     });
// }
