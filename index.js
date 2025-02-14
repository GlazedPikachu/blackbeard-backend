require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// Webhook Endpoint for Zapier
app.post('/webhook', async (req, res) => {
    const { audioBase64, text } = req.body;

    if (!audioBase64 || !text) {
        return res.status(400).json({ error: 'Both audioBase64 and text are required' });
    }

    console.log('✅ Received Audio and Text from Zapier');

    // Construct GitHub Pages URL
    const audioUrl = `${process.env.GITHUB_PAGES_URL}/audio/generated-${Date.now()}.mp3`;

    // Return structured JSON for Zapier
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        status: 'success',
        text: text,
        audioUrl: audioUrl,
        message: 'Response from Blackbeard AI'
    });
});

// Health Check Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Blackbeard Backend is running!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`⚓ Server running on port ${PORT}`);
});
