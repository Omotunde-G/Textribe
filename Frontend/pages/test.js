function showNotification(message) {
    const notificationContainer = document.getElementById('notificationContainer');
    const notificationMessage = document.getElementById('notificationMessage');
  
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
    showNotification('Clicks');
  }
  