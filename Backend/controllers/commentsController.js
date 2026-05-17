const db = require("../db/index");

// Add a new comment
const addComment = async (req, res) => {
    const { storyId } = req.params;
    const { user_id, comment_text } = req.body;

    if (!comment_text || !user_id) {
        return res.status(400).json({ message: "Comment text and user ID are required." });
    }

    try {
        const result = await db.query(
            "INSERT INTO comments (story_id, user_id, comment_text) VALUES ($1, $2, $3) RETURNING *",
            [storyId, user_id, comment_text]
        );
        res.status(201).json({ message: "Comment added successfully", comment: result.rows[0] });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment" });
    }
};

// Fetch comments for a specific story
const getCommentsByStoryId = async (req, res) => {
    const { storyId } = req.params;

    try {
        const result = await db.query(
            `SELECT c.comment_text, c.created_at, u.username 
             FROM comments c
             JOIN users u ON c.user_id = u.user_id
             WHERE c.story_id = $1
             ORDER BY c.created_at ASC`,
            [storyId]
        );
        res.status(200).json({ comments: result.rows });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Error fetching comments" });
    }
};

module.exports = { addComment, getCommentsByStoryId };
