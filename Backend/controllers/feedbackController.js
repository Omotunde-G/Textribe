const db = require("../db/index");


// Function to handle saving feedback
const sendFeedback = async (req, res) => {
    try {
        const { contributionId } = req.params;
        const { feedbackText } = req.body;

        // Find the contribution and update the feedback
        const contribution = await Contribution.findByPk(contributionId);
        if (!contribution) {
            return res.status(404).json({ message: 'Contribution not found' });
        }

        contribution.feedback = feedbackText;
        await contribution.save();

        res.status(200).json({ message: 'Feedback sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending feedback', error });
    }
};
// feedbackController.js

const getUserFeedback = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all contributions by the user with feedback
        const feedbacks = await Contribution.findAll({
            where: {
                userId: userId,
                feedback: { [Op.ne]: null } // Only fetch contributions with feedback
            }
        });

        res.status(200).json({ feedbacks });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error });
    }
};


module.exports = {
    sendFeedback, getUserFeedback
}
