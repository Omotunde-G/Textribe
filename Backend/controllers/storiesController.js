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

const fetchAllStories = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM stories");
    res.status(201).json({ stories: result.rows });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Error Fetching Stories" });
  }
};

const deteleStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const result = await db.query("DELETE FROM stories WHERE story_id = $1", [
      storyId,
    ]);
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

module.exports = {
  createStory,
  fetchAllStories,
  deteleStory,
  editStoryById,
  fetchStoriesByAuthorId,
};
