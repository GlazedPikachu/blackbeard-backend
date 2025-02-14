// Load environment variables
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 10000;

// 🛡️ Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ✅ Health Check Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Blackbeard Backend is running!' });
});

// 🏴‍☠️ Webhook Endpoint for Zapier
app.post('/webhook', async (req, res) => {
    const { text } = req.body;

    // 🛑 Validate Input
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    console.log('🏴‍☠️ Received from Zapier:', text);

    try {
        // 1️⃣ 🎙️ Generate Speech with Eleven Labs
        const elevenLabsResponse = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
            { text },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVENLABS_API_KEY,
                    'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`,
                },
                responseType: 'arraybuffer'
            }
        );

        const audioBase64 = Buffer.from(elevenLabsResponse.data).toString('base64');
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
        console.log('🎙️ Eleven Labs audio generated.');

        // 2️⃣ 🚀 Send Response to GitHub Pages URL
        const githubResponse = await axios.post(
            `${process.env.GITHUB_PAGES_URL}/audio-receiver`, // Ensure your GitHub Pages can handle POST
            {
                text,
                audioUrl
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log('🚀 Sent to GitHub Pages:', githubResponse.status);

        // ✅ Respond back to Zapier
        res.status(200).json({
            message: 'Voice generated and sent to GitHub Pages!',
            audioUrl
        });

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to process request',
            details: error.response?.data || error.message
        });
    }
});

// 🚀 Start the Server
app.listen(PORT, () => {
    console.log(`⚓ Blackbeard Backend is running on port ${PORT}`);
});
