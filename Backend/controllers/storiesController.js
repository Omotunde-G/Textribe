const db = require("../db/index");
const uploadImage = require("../utils/cloudinary");

// creating a story
const createStory = async (req, res) => {
  try {
    const response = await uploadImage(req.file.path);
    const { url } = response;
    const { title, author, content } = req.body;

    const { user_id } = req.params;
    // Check if required fields are present
    if (!title || !author || !content) {
      return res
        .status(400)
        .json({ message: "Title, author, content are required" });
    }

    // Check if user_id is present in localStorage

    const result = await db.query(
      "INSERT INTO stories (title, author, content, user_id, images) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, author, content, user_id, url]
    );

    res
      .status(201)
      .json({ message: "Story created successfully", story: result.rows[0] });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Error creating story" });
  }
};

// const fetchAllStories = async (req, res) => {
//   try {
//     const result = await db.query("SELECT * FROM stories");
//     res.status(201).json({ stories: result.rows });
//   } catch (error) {
//     console.error("Error fetching stories:", error);
//     res.status(500).json({ message: "Error Fetching Stories" });
//   }
// };

const fetchAllStories = async (req, res) => {
  try {
    // Fetch stories and include the count of likes for each story
    const result = await db.query(`
      SELECT stories.*, COUNT(story_likes.story_id) AS likeCount
      FROM stories
      LEFT JOIN story_likes ON stories.story_id = story_likes.story_id
      GROUP BY stories.story_id
    `);

    // Map the result to include the likeCount
    const storiesWithLikeCount = result.rows.map(story => ({
      ...story,
      likeCount: parseInt(story.likecount, 10)
    }));

    // Send the stories with like counts as a response
    res.status(201).json({ stories: storiesWithLikeCount });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Error Fetching Stories" });
  }
};


const deteleStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    // First, delete all likes associated with this story
    await db.query("DELETE FROM story_likes WHERE story_id = $1", [storyId]);

    // Then, delete all comments associated with this story
    await db.query("DELETE FROM comments WHERE story_id = $1", [storyId]);

    // Finally, delete the story itself
    const result = await db.query("DELETE FROM stories WHERE story_id = $1", [storyId]);

    if (result.rowCount === 1) {
      res.status(200).json({ message: "Story Deleted" });
    } else {
      res.status(404).json({ message: "Story not found" });
    }
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Error deleting story" });
  }
};


const editStoryById = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { title, content, author } = req.body;

    const result = await db.query(
      "UPDATE stories SET title = $1, content = $2, author = $3 WHERE story_id = $4",
      [title, content, author, storyId]
    );

    if (result.rowCount === 1) {
      res.status(200).json({ message: "Story updated successfully" });
    } else {
      res.status(404).json({ message: "Story not found" });
    }
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ message: "Error updating story" });
  }
};

const fetchStoriesByAuthorId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    console.log(userId);
    const result = await db.query(
      "SELECT story_id, title, content, created_at FROM stories WHERE user_id = $1",
      [userId]
    );
    console.log(result);

    if (result.rows.length >= 1) {
      res.status(200).json({ stories: result.rows });
    } else {
      res
        .status(404)
        .json({ message: "No stories found for the current user" });
    }
  } catch (error) {
    console.error("Error fetching stories by current user:", error);
    // Log the error more systematically, e.g., using a logging library
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const likeStory = async (req, res) => {
  try {
      const { storyId } = req.params;
      const userId = req.user ? req.user.user_id : null;  // Ensure user_id is retrieved correctly

      if (!userId) {
          console.error("User ID is not defined or user is not authenticated.");
          return res.status(401).json({ message: "Unauthorized: User ID is required." });
      }

      console.log("User ID:", userId);
      console.log("Story ID:", storyId);

      // Check if user has liked the story before 
      const existingLike = await db.query(
          "SELECT * FROM story_likes WHERE story_id = $1 AND user_id = $2",
          [storyId, userId]
      );

      if (existingLike.rows.length > 0) {
          return res.status(400).json({ message: "You have already liked this story." });
      }

      const result = await db.query(
          "INSERT INTO story_likes (story_id, user_id) VALUES ($1, $2) RETURNING *",
          [storyId, userId]
      );

      res.status(201).json({ message: "Story liked successfully", like: result.rows[0] });
  } catch (error) {
      console.error("Error liking story:", error);
      res.status(500).json({ message: "Error liking story" });
  }
};


  // Fetch the number of likes for a story
const getStoryLikes = async (req, res) => {
  try {
    const { storyId } = req.params;

    const result = await db.query(
      "SELECT COUNT(*) FROM story_likes WHERE story_id = $1",
      [storyId]
    );

    res.status(200).json({ likes: result.rows[0].count });
  } catch (error) {
    console.error("Error fetching story likes:", error);
    res.status(500).json({ message: "Error fetching story likes" });
  }
};
// my story 
const getStoriesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const stories = await Story.findAll({ where: { userId } });
    if (!stories.length) {
      return res.status(404).json({ message: 'No stories found for this user' });
    }
    res.json({ stories });
  } catch (error) {
    console.error("Error fetching stories for user:", error);
    res.status(500).json({ message: 'Error fetching stories' });
  }
};
module.exports = {
  createStory,
  fetchAllStories,
  deteleStory,
  editStoryById,
  fetchStoriesByAuthorId,
  likeStory,
  getStoryLikes,
  getStoriesByUser
};
