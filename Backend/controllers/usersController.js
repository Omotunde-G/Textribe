
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
const fetchUserProfiles = async (req, res) =>{
    try {
        const query = 'SELECT * FROM user_profile';
        const result = await db.query(query);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users profiles', error)
        res.status(500).json({message: 'error fetching users profile'})
        
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


const CreateOrUpdateUserProfile = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { bio, username, fullname, location, numberOfStories } = req.body;

        // Check if the user profile already exists
        const existingProfileData = await db.query('SELECT * FROM user_profile WHERE user_id = $1', [user_id]);

        if (existingProfileData.rows.length === 0) {
            // If the user profile doesn't exist, insert a new record
            const insertResult = await db.query('INSERT INTO user_profile (user_id, bio, username, fullname, location, number_of_stories) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [user_id, bio, username, fullname, location, numberOfStories]);

            if (insertResult.rowCount === 1) {
                res.status(201).json({ message: 'Profile Created' });
            } else {
                res.status(404).json({ message: 'Error creating Profile' });
            }
        } else {
            // If the user profile exists, update it
            const currentData = existingProfileData.rows[0];

            const updatedData = {
                bio: bio !== undefined && bio !== '' ? bio : currentData.bio,
                username: username !== undefined && username !== '' ? username : currentData.username,
                fullname: fullname !== undefined && fullname !== '' ? fullname : currentData.fullname,
                location: location !== undefined && location !== '' ? location : currentData.location,
                number_of_stories: numberOfStories !== undefined && numberOfStories !== '' ? numberOfStories : currentData.number_of_stories
            };

            const updateResult = await db.query(`
                UPDATE user_profile
                SET bio = $1, username = COALESCE($2, username), fullname = $3, location = $4, number_of_stories = $5
                WHERE user_id = $6
                RETURNING *
            `, [updatedData.bio, updatedData.username, updatedData.fullname, updatedData.location, updatedData.number_of_stories, user_id]);

            if (updateResult.rowCount === 1) {
                res.status(200).json({ message: 'Profile Updated', data: updateResult.rows[0] });
            } else {
                res.status(404).json({ message: 'Error updating Profile' });
            }
        }
    } catch (error) {
        console.error('Error Creating/Updating profile', error);
        res.status(500).json({ message: 'Error Creating/Updating profile' });
    }
};



        

module.exports = {fetchUser , UserProfile, CreateOrUpdateUserProfile, fetchUserById, fetchUserByUsername,  fetchUserProfiles}