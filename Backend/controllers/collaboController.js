const db = require("../db/index")

  const fetchcontributions =async (req, res) =>{
    try {
        const result = await db.query ('SELECT * FROM contributions');
        res.status(201).json({contributions: result.rows});
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ message: 'Error Fetching Stories'})
        
    }
  } 
  const fetcher = async (req, res) => {
    try {
        const result = await db.query ('SELECT * FROM contributions');
        res.status(201).json({contributions: result.rows});
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ message: 'Error Fetching Stories'})
        
    }
  };
  
  module.exports = {fetchcontributions, fetcher}