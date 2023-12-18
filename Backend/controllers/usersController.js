
const db = require('../db/index');

const fetchUser = async (req, res ) => {
    try {
        const query = 'SELECT * FROM users;'
        const result = await db.query(query)

        res.json(result.rows);
    }catch(error){
        console.error('Error fetching Users', error)
        res.status(500).json({message: 'Error Fetching users' })
    };
  
}

const fetchUserById = async (req, res) => {
    try {
        const {user_id} = req.params;
       const result = await db.query ('SELECT * FROM user_profile WHERE user_id = $1', [user_id]);
       res.json(result.rows);
    } catch (error) {
        console.error('Error fetching User', error)
        res.status(500).json({message: 'Error Fetching The User'})
        
    }
      
}
const fetchUserByUsername = async (req, res) => {
    try {
        const {username} = req.params;
        const result =  await db.query ('SELECT * FROM user_profile WHERE username =$1', [username]);
        res.json(result.rows)
    } catch (error) {
        console.error('Error fetching user Profile'. error)
        res.status(500).json({message: 'Error Fetching User profile by username '})
    }
}

const createUserProfileByUsername = async (req, res) => {
    try {
        const {user_id} = req.params;
        const { username, bio, fullname, location, numberOfStories } = req.body;

        if (user_id) {
            // If 'user_id' is provided, use it directly
            const result = await db.query('INSERT INTO user_profile (user_id, bio, fullname, location, number_of_stories) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_id, bio, fullname, location, numberOfStories]);
            res.status(201).json({ message: 'Profile Created' });
        } else if (username) {
            // If 'username' is provided, fetch 'user_id' from the username
            const user = await getUserIdFromUsername(username);
            if (user && user.user_id) {
                const result = await db.query('INSERT INTO user_profile (user_id, bio, fullname, location, number_of_stories) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user.user_id, bio, fullname, location, numberOfStories]);
                res.status(201).json({ message: 'Profile Created' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else {
            res.status(400).json({ message: 'Missing user_id or username' });
        }
    } catch (error) {
        console.error('Error Creating Profile', error);
        res.status(500).json({ message: 'Error Creating Profile' });
    }
};

const getUserIdFromUsername = async (username) => {
    try {
        // Perform the database query to retrieve user_id based on username
        // Replace this with your actual database query logic
        const result = await db.query('SELECT user_id FROM users WHERE username = $1', [username]);

        // Assuming the query result contains the user_id
        if (result && result.rows.length > 0) {
            return result.rows[0]; // Return the user object containing user_id
        } else {
            return null; // Return null if user with the given username doesn't exist
        }
    } catch (error) {
        console.error('Error fetching user_id from username:', error);
        throw error;
    }
};



const UserProfile = async (req, res) => {
    try {
        const {username} = req.params;
        const { user_id, bio,  fullname, location, numberOfStories} = req.body
        let result = await db.query('INSERT INTO user_profile (user_id, bio, username, fullname, location, number_of_stories) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [user_id, bio, username, fullname, location, numberOfStories]);
        res.status(201).json({ message: 'Profile Created' });
       } catch (error) {
        console.error('Error Creating Profile', error);
        res.status(500).json({ message: 'Error Creating Profile' });
    }
};

        const UpdateUserProfile = async (req, res) => {
            try {
                const {user_id} = req.params;
                const {bio, username, fullname, location, numberOfStories} = req.body;
                const result = await db.query('UPDATE user_profile SET bio= $2,  username = $3, fullname= $4, location = $5, number_of_stories = $6 WHERE user_id = $1' , [user_id, bio, username, fullname,location, numberOfStories])
                if (result.rowCount === 1) {
                    res.status(200).json({message: "Profile Updated"})
                } else {
                    res.status(404).json({ message: 'Error updating Profile'})
                }
            } catch (error) {
                console.error('Error Updating profile', error)
                res.status(500).json({message : "error updating profile"})
        
                
            }
         };
        

module.exports = {fetchUser , UserProfile, UpdateUserProfile, fetchUserById, fetchUserByUsername, createUserProfileByUsername }