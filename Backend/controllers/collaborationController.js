const db = require("../db/index");

// Save a draft contribution
const saveContributionDraft = async (req, res) => {
  const { storyId } = req.params;
  const { contributorName, contributionText } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO CollaboratedStories (story_id, contributor_name, contribution_text, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [storyId, contributorName, contributionText, "Draft"]
    );
    res
      .status(201)
      .json({
        message: "Contribution saved as draft",
        contribution: result.rows[0],
      });
  } catch (error) {
    console.error("Error saving draft:", error);
    res.status(500).json({ message: "Error saving draft" });
  }
};

// Submit a contribution
const submitContribution = async (req, res) => {
  const { storyId } = req.params;
  const { contributorName, contributionText } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO CollaboratedStories (story_id, contributor_name, contribution_text, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [storyId, contributorName, contributionText, "Pending"]
    );
    res
      .status(201)
      .json({
        message: "Contribution submitted",
        contribution: result.rows[0],
      });
  } catch (error) {
    console.error("Error submitting contribution:", error);
    res.status(500).json({ message: "Error submitting contribution" });
  }
};

// Retrieve contributions for a specific author
const getContributionsByAuthor = async (req, res) => {
  const { authorId } = req.params;

  try {
    const result = await db.query(
      "SELECT cs.*, s.title FROM CollaboratedStories cs JOIN Stories s ON cs.story_id = s.story_id WHERE s.user_id = $1 AND cs.status = $2",
      [authorId, "Pending"]
    );
    res.status(200).json({ contributions: result.rows });
  } catch (error) {
    console.error("Error retrieving contributions:", error);
    res.status(500).json({ message: "Error retrieving contributions" });
  }
};

const acceptContribution = async (req, res) => {
  const { id } = req.params; // This is the contribution ID

  try {
      // Find the contribution by its ID
      const contribution = await db.query('SELECT * FROM collaboratedStories WHERE id = $1', [id]);

      if (contribution.rows.length === 0) {
          return res.status(404).json({ message: 'Contribution not found' });
      }

      const { story_id, contributor_name, contribution_text } = contribution.rows[0];

      // Fetch the original story
      const story = await db.query('SELECT * FROM stories WHERE story_id = $1', [story_id]);

      if (story.rows.length === 0) {
          return res.status(404).json({ message: 'Original story not found' });
      }

      // Add contributor name as a header and wrap the content with a unique class for styling
      const contributorHeader = `<h3 class="contributor-header">${contributor_name}</h3>`;
      const contributorContent = `<div class="contributor-content">${contribution_text}</div>`;

      // Update the original story with the new content and header
      const updatedContent = `${story.rows[0].content}\n\n${contributorHeader}${contributorContent}`;

      await db.query('UPDATE stories SET content = $1 WHERE story_id = $2', [updatedContent, story_id]);

      // Remove the contribution from collaboratedStories after it has been accepted and merged
      await db.query('DELETE FROM collaboratedStories WHERE id = $1', [id]);

      // Return the updated story content for confirmation
      console.log("Updated Content being sent to frontend:", updatedContent);
      res.status(200).json({ message: 'Contribution accepted and merged into the original story', updatedContent });
  } catch (error) {
      console.error('Error accepting contribution:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


// Decline a contribution
const declineContribution = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("UPDATE CollaboratedStories SET status = $1 WHERE id = $2", [
      "Declined",
      id,
    ]);
    res.status(200).json({ message: "Contribution declined" });
  } catch (error) {
    console.error("Error declining contribution:", error);
    res.status(500).json({ message: "Error declining contribution" });
  }
};
// const sendFeedback = async (req, res) => {
//     const { id } = req.params;
//     const { feedbackText } = req.body;

//     try {
//         const result = await db.query(
//             'INSERT INTO Feedback (contribution_id, feedback_text) VALUES ($1, $2) RETURNING *',
//             [id, feedbackText]
//         );

//         if (result.rowCount === 0) {
//             return res.status(404).json({ message: 'Contribution not found' });
//         }

//         res.status(200).json({ message: 'Feedback sent successfully' });
//     } catch (error) {
//         console.error('Error sending feedback:', error);
//         res.status(500).json({ message: 'Error sending feedback' });
//     }
// };

const sendFeedback = async (req, res) => {
  const { id } = req.params; // id is the contribution's id in collaboratedStories
  const { feedbackText } = req.body;

  try {
    // Ensure the contribution exists in collaboratedStories
    const contributionCheck = await db.query(
      "SELECT * FROM collaboratedStories WHERE id = $1",
      [id]
    );

    if (contributionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Contribution not found" });
    }

    // Insert feedback into a feedbacks table or handle it as needed
    const result = await db.query(
      "INSERT INTO feedbacks (contribution_id, feedback_text) VALUES ($1, $2) RETURNING *",
      [id, feedbackText]
    );

    res
      .status(200)
      .json({
        message: "Feedback sent successfully",
        feedback: result.rows[0],
      });
  } catch (error) {
    console.error("Error sending feedback:", error);
    res.status(500).json({ message: "Error sending feedback" });
  }
};

const mergeContribution = async (req, res) => {
    const { id } = req.params; // id is the contribution's id in collaboratedStories

    try {
        // Fetch the contribution details from collaboratedStories
        const contributionResult = await db.query(
            "SELECT * FROM collaboratedStories WHERE id = $1",
            [id]
        );

        if (contributionResult.rows.length === 0) {
            return res.status(404).json({ message: "Contribution not found" });
        }

        const contribution = contributionResult.rows[0];

        // Fetch the original story using story_id
        const storyResult = await db.query(
            "SELECT * FROM stories WHERE story_id = $1",
            [contribution.story_id]
        );

        if (storyResult.rows.length === 0) {
            return res.status(404).json({ message: "Original story not found" });
        }

        let originalStory = storyResult.rows[0];

        // Merge the contribution into the original story
        const updatedContent =
            originalStory.content + "\n\n" + contribution.contribution_text;

        // Update the original story with the merged content
        await db.query("UPDATE stories SET content = $1 WHERE story_id = $2", [
            updatedContent,
            contribution.story_id,
        ]);

        console.log("Updated Story Content:", updatedContent);

        // Update the contribution status to "Accepted"
        await db.query("UPDATE collaboratedStories SET status = $1 WHERE id = $2", [
            "Accepted",
            id,
        ]);

        // Respond with the story_id
        res.status(200).json({
            message: "Contribution merged successfully into the original story",
            story_id: contribution.story_id
        });
    } catch (error) {
        console.error("Error merging contribution:", error);
        res.status(500).json({ message: "Error merging contribution" });
    }
};
// Get a single contribution by ID
const getContributionById = async (req, res) => {
  const { id } = req.params;

  try {
    const contribution = await db.query(
    
      "SELECT cs.*, s.title FROM CollaboratedStories cs JOIN Stories s ON cs.story_id = s.story_id WHERE s.user_id = $1 AND cs.status = $2",
      [id, "Pending"]
    );
    

    if (contribution.rows.length === 0) {
      return res.status(404).json({ message: "Contribution not found" });
    }

    res.json(contribution.rows[0]);
  } catch (error) {
    console.error("Error fetching contribution:", error);
    res.status(500).json({ message: "Error fetching contribution" });
  }
};

  

module.exports = {
  saveContributionDraft,
  submitContribution,
  getContributionsByAuthor,
  acceptContribution,
  declineContribution,
  sendFeedback,
  mergeContribution,
  getContributionById
};
