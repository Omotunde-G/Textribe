function showNotification(message) {
    const notificationContainer = document.createElement('div')
    notificationContainer.innerHTML = `<img src="http://res.cloudinary.com/dbrhmbvkl/image/upload/v1706356379/main/uploads/ian-schneider-TamMbr4okv4-unsplash.jpeg.jpg" />`

  
    notificationMessage.innerText = message;
    notificationContainer.style.opacity = 1;
  
    // Auto-close after 3 seconds
    setTimeout(() => {
      closeNotification();
    }, 3000);
  }
  
  function closeNotification() {
    const notificationContainer = document.getElementById('notificationContainer');
    notificationContainer.style.opacity = 0;
  }
  
  function triggerNotification() {
    // Change the message to "Clicks" or any other desired message
    showNotification(notificationContainer);
  }
  