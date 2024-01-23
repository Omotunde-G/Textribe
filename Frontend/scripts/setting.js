// Login function
async function loginUser(e) {
    e.preventDefault();

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
            const { token, username: loggedInUsername, userId } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('loggedInUsername', loggedInUsername);
            localStorage.setItem('user_id', userId);

            // Redirect to the user dashboard or profile page
            window.location = "userdashboard.html";
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display logged-in username
function displayLoggedInUsername() {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const usernameDisplayElement = document.querySelectorAll('#usernameDisplay');

    usernameDisplayElement.forEach(element => {
        element.textContent = loggedInUsername || 'Guest';
    })
}

// Function to log out user
function logoutUser() {
    console.log('log out function called')
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUsername');
    localStorage.removeItem('userId');
    window.location.href = './login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.querySelector('.logout');
    const userProfileForm = document.getElementById('userProfileForm');

    displayLoggedInUsername();

    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // test 
    userProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        const fullnameInput = document.getElementById('userfullname');
        const bioInput = document.getElementById('bio');
        const locationInput = document.getElementById('location');
        const numberOfStoriesInput = document.getElementById('numberOfStories');
        const usernameInput = document.getElementById('username')

        const fullname = fullnameInput.value;
        const bio = bioInput.value;
        const location = locationInput.value;
        const numberOfStories = numberOfStoriesInput.value;
        const username = usernameInput.value;

        const loggedInUsername = localStorage.getItem('loggedInUsername');

    const userData = {
        user_id : userId,
        fullname,
        bio,
        location,
        numberOfStories,
        username: loggedInUsername
    };
    try {
        let response;
        const userProfile = await fetchUserProfile(loggedInUsername);
         
        if (!userProfile) {
            // If user profile doesn't exist, create a new one
            response = await fetch(`http://localhost:3005/users/updateProfile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        } else {
            // If user profile exists, update it using PUT request
            response = await fetch(`http://localhost:3005/users/updateProfile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
                }
        if (response.ok) {
            const updatedProfile = await fetchUserProfile(loggedInUsername);
            displayUserProfile(updatedProfile);
          
        } else {
            console.error('Error updating user profile');
        }
    } catch (error) {
    }
});

async function fetchUserProfile(username) {
    try {
        const response = await fetch(`http://localhost:3005/users/userProfile/${username}`);
        if (response.ok) {
            const userProfile = await response.json();
            displayUserProfile(userProfile[0])   
        }
    } catch (error) {

    }
    if (fetchUserProfile) {
        
        alert('profile Updated')
        
    }else{
        alert('profile not updated')
    }
} 
// Function to display user profile data
function displayUserProfile(userData) {
    const FullnameElem = document.getElementById('userfullname');
    const BioElem = document.getElementById('bio');
    const LocationElem = document.getElementById('location');
    const NumOfStoriesElem = document.getElementById('numberOfStories');

    // Set input values with user profile data
    FullnameElem.value = userData.fullname || '';
    BioElem.value = userData.bio || '';
    LocationElem.value = userData.location || '';
    NumOfStoriesElem.value = userData.numberOfStories || '';

    // Reset input values to empty if the profile has been updated
    if (userData.updated) {
        FullnameElem.value = '';
        BioElem.value = '';
        LocationElem.value = '';
        NumOfStoriesElem.value = '';
        alert('Profile updated successfully!');
    }
}

})