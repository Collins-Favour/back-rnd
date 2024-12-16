const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://frenchkaptain:nkkUP2zRjYrW90UT@feedbacks.jqugy.mongodb.net/?retryWrites=true&w=majority&appName=Feedbacks'; // Replace with your MongoDB Atlas URI if using cloud
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Feedback Schema and Model
const feedbackSchema = new mongoose.Schema({
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Endpoint to receive feedback
app.post('/submit-feedback', async (req, res) => {
    const feedbackMessage = req.body.feedback;

    if (!feedbackMessage) {
        return res.status(400).send({ message: 'Feedback is required' });
    }

    try {
        const feedback = new Feedback({ message: feedbackMessage });
        await feedback.save();
        res.send({ message: 'Feedback received' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to save feedback', error });
    }
});

// Admin route to view feedback
app.get('/admin/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
        res.send(`<pre>${JSON.stringify(feedbacks, null, 2)}</pre>`);
    } catch (error) {
        res.status(500).send({ message: 'Failed to load feedback', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
