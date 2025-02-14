// Blackbeard Voice Backend for Render Deployment
// Dependencies and Configuration
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware Setup
app.use(express.json());

// Webhook Endpoint for Receiving ChatGPT Text and Calling Eleven Labs
app.post('/webhook', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    console.log('Received from Zapier:', text);

    try {
        // Eleven Labs Text-to-Speech API Call
        const elevenLabsResponse = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
            { text },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVENLABS_API_KEY,
                },
                responseType: 'arraybuffer'
            }
        );

        // Create Base64 Audio URL for GitHub Pages
        const audioBase64 = Buffer.from(elevenLabsResponse.data).toString('base64');
        res.status(200).json({
            text,
            audioUrl: `data:audio/mpeg;base64,${audioBase64}`
        });
    } catch (error) {
        console.error('Error generating speech:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate audio' });
    }
});

// Health Check Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Blackbeard Backend is running!' });
});

// Server Initialization
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
