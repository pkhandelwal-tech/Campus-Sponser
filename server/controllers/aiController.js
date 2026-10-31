const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 👇 Securely Load Environment Variables
require('dotenv').config();

// 1. GENERATE EVENT DESCRIPTION / IDEAS
const getAIResponse = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    // 🔒 SECURITY CHECK: Key .env se aa rahi hai ya nahi
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

    if (!apiKey) {
        console.error("❌ ERROR: AI_API_KEY is missing in .env file");
        res.status(500);
        throw new Error("Server Configuration Error: AI Key Missing");
    }

    if (!prompt) {
        res.status(400);
        throw new Error("Please provide a prompt");
    }

    try {
        // ✨ Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // 🧠 AI Thinking...
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // ✅ Send Response
        res.json({ 
            success: true, 
            data: text 
        });

    } catch (error) {
        console.error("❌ AI Error:", error.message);
        res.status(500);
        throw new Error("AI Service Failed: " + error.message);
    }
});

module.exports = { getAIResponse };