
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
module.exports = {fetchUser}