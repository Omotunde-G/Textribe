
  function fetchUserStories() {
    fetch('http://localhost:3002/story/user-stories', {
      method: 'GET',
      // Add headers if required (e.g., for authentication)
    })
      .then(response => response.json())
      .then(data => {
        // Process fetched stories and update the UI
        const cardContainers = document.querySelectorAll('.card--wrapper');

        // Example: Loop through the fetched stories and populate the card containers
        data.forEach((story, index) => {
          const cardIndex = index % cardContainers.length;
          const cardWrapper = cardContainers[cardIndex];

          const paymentCard = document.createElement('div');
          paymentCard.classList.add('payment--card', `light-${cardIndex}`);

          const cardHeader = document.createElement('div');
          cardHeader.classList.add('card--header');

          const amount = document.createElement('div');
          amount.classList.add('amount');

          const title = document.createElement('span');
          title.classList.add('title');
          title.textContent = story.title;

          const separator = document.createElement('hr');
          separator.classList.add('seperator');

          const workType = document.createElement('span');
          workType.classList.add('work-type');
          workType.textContent = story.content;

          amount.appendChild(title);
          amount.appendChild(separator);
          amount.appendChild(workType);

          cardHeader.appendChild(amount);
          paymentCard.appendChild(cardHeader);

          cardWrapper.appendChild(paymentCard);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  // Call function to fetch user stories on page load
  window.addEventListener('load', fetchUserStories);


