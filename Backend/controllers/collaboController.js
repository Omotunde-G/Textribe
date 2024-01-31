const db = require("../db/index")
const fetchAllContribution = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contributions');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contributions:', error);
    res.status(500).send('Internal Server Error');
  }
};
const addContribution = async (req, res) =>{
    const { story_id, content } = req.body;
    try {
      const result = await db.query('INSERT INTO contributions (story_id, content) VALUES ($1, $2) RETURNING *', [story_id, content]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error adding contribution:', error);
      res.status(500).send('Internal Server Error');
    }
  
};

const getContributeAndOrigin = async (req, res) => {
    try {
      const result = await db.query(`
        SELECT c.contribution_id, c.story_id, c.content AS contribution_content, s.content AS story_content
        FROM contributions c
        JOIN stories s ON c.story_id = s.story_id
      `);
  
      res.json(result.rows);
      console.log(result)
    } catch (error) {
      console.error('Error fetching contributions with stories:', error);
      res.status(500).send('Internal Server Error');
    }
};

const updateContributions = async (req, res) => {
  const {story_id} = req.params

  try {
    const result = await db.query(`
      UPDATE contributions AS c
      SET content = s.content
      FROM stories AS s
      WHERE c.story_id = s.story_id AND c.story_id = $1
      RETURNING c.contribution_id, c.story_id, c.content AS contribution_content, s.content AS story_content;
    `, [story_id]);

    return result.rows;
  } catch (error) {
    console.error('Error updating contributions:', error);
    throw new Error('Internal Server Error');
  }
};



module.exports ={ fetchAllContribution, addContribution, getContributeAndOrigin, updateContributions  }
