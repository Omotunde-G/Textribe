const db = require("../db/index")

// creating a story
const createStory = async (req, res) => {
    console.log('Request body:', req.body);
        try {
          const { title, content, author } = req.body;
          if(!title || !author || !content){
            return res.status(400).json({ message: 'Title, author, content are required'})
          }
          const result = await db.query('INSERT INTO stories (title, author, content) VALUES ($1, $2, $3) RETURNING *', [title, author, content]);
          res.status(201).json({ message: 'Story created successfully', story: result.rows[0] });
        } catch (error) {
          console.error('Error creating story:', error);
          res.status(500).json({ message: 'Error creating story' });
        }
      };

      //an experiment//

  const fetchAllStories =async (req, res) =>{
    try {
        const result = await db.query ('SELECT title, author,content , story_id, created_at FROM stories');
        res.status(201).json({stories: result.rows});
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ message: 'Error Fetching Stories'})
        
    }
  }   




const deteleStory =  async (req, res) =>{
    try {
        const { storyId } = req.params; 
         const result = await db.query('DELETE FROM stories WHERE story_id = $1', [storyId])
         if(result.rowCount === 1) {
            res.status(200).json({message:'Story Deleted'})
         }else {
            res.status(404).json({ message: 'Story not found' });
         }
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({ message: 'Error deleting story' });
    }
}

const editStoryById = async (req, res) => {
    try {
        const { storyId } = req.params;
        const { title, content, author } = req.body;

        const result = await db.query('UPDATE stories SET title = $1, content = $2, author = $3 WHERE story_id = $4', [title, content, author, storyId]);

        if (result.rowCount === 1) {
            res.status(200).json({ message: 'Story updated successfully' });
        } else {
            res.status(404).json({ message: 'Story not found' });
        }
    } catch (error) {
        console.error('Error updating story:', error);
        res.status(500).json({ message: 'Error updating story' });
    }
};



const fetchStoriesByAuthor = async (req, res) => {
    try {
        const { author } = req.params;
        const result = await db.query(
            'SELECT title, author, created_at, story_id, content FROM stories WHERE author = $1',
            [author]
        );

        if (result.rows.length >= 1) {
            res.status(200).json({ stories: result.rows });
        } else {
            res.status(404).json({ message: 'No stories found for the author' });
        }
    } catch (error) {
        console.error('Error fetching stories by author:', error);
        res.status(500).json({ message: 'Error fetching stories' });
    }
};


// const fetchStoryById = async (req, res) => {
//     try {
//         const { storyId } = req.params;

//         const result = await db.query('SELECT * FROM stories WHERE story_id = $1', [storyId]);

//         if (result.rows.length === 1) {
//             res.status(200).json(result.rows[0]);
//         } else {
//             res.status(404).json({ message: 'Story not found' });
//         }
//     } catch (error) {
//         console.error('Error fetching story by ID:', error);
//         res.status(500).json({ message: 'Error fetching story by ID' });
//     }
// };




  module.exports= {createStory, fetchAllStories, deteleStory, editStoryById, fetchStoriesByAuthor}

// const fetchStoryById = async (req, res) => {
//     try {
//       const { storyId } = req.query;
//       const result = await db.query('SELECT * FROM stories WHERE story_id = $1', [storyId]);
//       res.json(result.rows);
//     } catch (error) {
//       console.error('Error fetching story by ID', error);
//       res.status(500).json({ message: 'Error fetching story by ID' });
//     }
//   };

//   // creating a collabotation
// const createCollaboration =   async (req, res) =>{
//     try {
//         const {storyId, contributor, contribution} = req.body;
//         const result = await db.query('INSERT INTO collaboration (storyId, contributor, contribution) VALUES ($1, $2, $3)', [storyId, contributor, contribution]);
//         res.status(201).json({ message: 'Collaboration created successfully', collaborationId: result.insertId });
//       } catch (error) {
//         console.error('Error creating collaboration:', error);
//         res.status(500).json({ message: 'Error creating collaboration' });
//       }
// }


// // view all collaboration for an orignal story 
// const getCollaborationsForStory = async (req, res) =>{
//     try {
//         const storyId = req.params.storyId;
//         const result = await db.query('SELECT * FROM collaboration WHERE storyId = $1', [storyId]);
//         res.json(result.rows);
//       } catch (error) {
//         console.error('Error fetching collaborations:', error);
//         res.status(500).json({ message: 'Error fetching collaborations' });
//       }
// } 



// module.exports = { createStory, fetchStoryById, createCollaboration, getCollaborationsForStory }



// //  const fetchAllStories = async (req, res) =>{
// //     try {
// //         const storyId  = req.params.story_id;
// //         const result = await db.query('SELECT * FROM stories (title, content) VALUES ($1, $2)', [title, content]);
// //         res.json(result.rows);
// //     } catch (error) {
// //         console.error('Error fetching stories', error);
// //         res.status(500).json({message: 'Error fetching Stories'})
        
// //     }
// // }
// // // creating a collabotation
// // function createCollaboration() {  async (req, res) =>{
// //     try {
// //         const {storyId, contributor, contribution} = req.body;
// //         const result = await db.query('INSERT INTO collaboration (storyId, contributor, contribution) VALUES ($1, $2, $3)', [storyId, contributor, contribution]);
// //         res.status(201).json({ message: 'Collaboration created successfully', collaborationId: result.insertId });
// //       } catch (error) {
// //         console.error('Error creating collaboration:', error);
// //         res.status(500).json({ message: 'Error creating collaboration' });
// //       }
// // }
// // }

// // // view all collaboration for an orignal story 
// // function getCollaborationsForStory() { async (req, res) =>{
// //     try {
// //         const storyId = req.params.storyId;
// //         const result = await db.query('SELECT * FROM collaboration WHERE storyId = $1', [storyId]);
// //         res.json(result.rows);
// //       } catch (error) {
// //         console.error('Error fetching collaborations:', error);
// //         res.status(500).json({ message: 'Error fetching collaborations' });
// //       }
// // } 
// // }
// // // accepting a colab

// // function acceptCollaborationAndUpdateStory() {  async (req, res) =>{
// //    try{
// //     const collaborationId = req.params.collaborationId;
    
// //     const collaboration =  await db.query('SELECT * FROM collaboration WHERE id=$1', [collaborationId]);
// //     await db.query('UPDATE stories SET content = $1 WHERE id = $2', [collaboration.contribution, collaboration.storyId])

// //    await db.query('DELETE FROM collaboration WHERE id = $1',[collaborationId])
// //    res.json({ message: 'Collaboration accepted and story Updated'});
// //    } catch(error){
// //     console.error('Error Accepting Collaboration:', error)
// //     res.status(500).json({ message: 'Error accepting collaboration' });
// //    }  

// // }
// // }

// // function rejectCollaboration() { async (req, res) => {
// //     try {
// //       const { collaborationId } = req.body;
  
// //       const deleteQuery = 'DELETE FROM collaboration WHERE id = $1';
// //       const deleteResult = await db.query(deleteQuery, [collaborationId]);
// //       if (deleteResult.rowCount === 1) {
// //         res.status(200).json({ message: 'Collaboration rejected successfully' });
// //       } else {
// //         res.status(404).json({ message: 'Collaboration not found or could not be rejected' });
// //       }
// //     } catch (error) {
// //       console.error('Error rejecting collaboration:', error);
// //       res.status(500).json({ message: 'Error rejecting collaboration' });
// //     }
// //   }
// // };

// //   module.exports = { createStory, createCollaboration, getCollaborationsForStory, acceptCollaborationAndUpdateStory, rejectCollaboration, fetchAllStories } 