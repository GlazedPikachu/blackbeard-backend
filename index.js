// Load environment variables
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware to parse JSON requests
app.use(express.json());

// Webhook Endpoint for Zapier
app.post('/webhook', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    console.log('Received from Zapier:', text);

    // Simulate sending to GitHub Pages (if needed)
    const responsePayload = {
        text,
        audioUrl: `${process.env.GITHUB_PAGES_URL}/audio/sample.mp3` // Example URL
    };

    res.status(200).json(responsePayload);
});

// Health Check Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Blackbeard Backend is running!' });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
