try {
    let response;
    const userProfile = await fetchUserProfile(loggedInUsername);
     
    if (!userProfile) {
       
        // If user profile doesn't exist, create a new one
        response = await fetch(`http://localhost:3002/users/userProfile/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
    } else {
        // If user profile exists, update it using PUT request
        response = await fetch(`http://localhost:3002/users/updateProfile/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
    }
    console.log(userData)

    if (response.ok) {
        const updatedProfile = await fetchUserProfile(loggedInUsername);
        displayUserProfile(updatedProfile);
    } else {
        console.error('Error updating user profile');
    }
} catch (error) {
    console.error('Error updating user profile:', error);
}
});

async function fetchUserProfile(loggedInUsername) {
try {
     response = await fetch(`http://localhost:3002/users/updateProfile/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(userData)
     }) ;
    if (response.ok) {
        const userProfile = await response.json();
        return userProfile[0];
    }
} catch (error) {
    console.error('Error fetching user profile:', error);
}
}

function displayUserProfile(userData) {
const FullnameElem = document.getElementById('fullname');
const BioElem = document.getElementById('bio');
const locationElem = document.getElementById('location');
const numOfStories = document.getElementById('number_of_stories');

FullnameElem.value = userData.fullname || '';
BioElem.value = userData.bio || '';
locationElem.value = userData.location || '';
numOfStories.value = userData.number_of_stories || '';
}