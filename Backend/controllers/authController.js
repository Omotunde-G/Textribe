const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db/index');
const saltRounds = Number(process.env.saltRounds);
const secretKey = process.env.secretKey;
require('dotenv').config()


const userExists = async (username) => {
    try {
      const query = 'SELECT * FROM users WHERE username = $1';
      const result = await db.query(query, [username]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking username existence:', error);
      throw error;
    }
  };
// Registration
const registerUser = async (req, res) => {
  const {fullname, username, password } = req.body;
  console.log(req.body);

  const doesUserExist = await userExists(username);
  if (doesUserExist) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds); 
    const insertQuery = "INSERT INTO users (fullname, username, password) VALUES ($1, $2, $3) RETURNING user_id";
    const result = await db.query(insertQuery, [fullname, username , hashedPassword]);
    
    const user_id = result.rows[0].user_id;

    const token = jwt.sign({ username }, secretKey, {
      expiresIn: 60 * 60,
    });

    res.status(201).json({ message: 'User registered successfully', token , user_id});
  } catch (error) {
    console.error('Error retrieving user:', error);
     res.status(500).json({ message: 'Error retrieving user' });
  }
};

// Login

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = 'SELECT user_id, password FROM users WHERE username = $1 ';
    const result = await db.query(query, [username]);
    const user = result.rows[0];
    
    
    if (!user) {
        return res.status(404).json({message : 'user not found'})
        
    }
    
        // Compare the entered password with the hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ username }, secretKey, {
      expiresIn: 60 * 60,
    });

    res.json({ message: 'Login successful', token, username, user_id: user.user_id });
} catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
  
};

module.exports = { registerUser, loginUser };
