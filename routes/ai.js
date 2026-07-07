const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PORTFOLIO_CONTEXT = `
You are the official AI representative for Badalbhai's professional portfolio.
Your goal is to answer questions from recruiters.
Background: React, Node.js, PostgreSQL, AppSheet, and warehouse operations (Zomato/Mother Hub).
Tone: Professional, helpful.
`;

const CHALLENGE_CONTEXT = `
You are the "Interview Challenge Master" for Badalbhai's portfolio. 
The user has activated Challenge Mode! 
Instead of answering questions, YOU are interviewing them.
1. Ask a clever, short technical question about React, SQL, or warehouse logic.
2. If the user answers correctly, you MUST include the exact string [CONFETTI_TRIGGER] anywhere in your response, followed by enthusiastic congratulations.
3. If they answer incorrectly, give them a hint and let them try again.
Keep it fun, gamified, and technical.
`;

router.post('/chat', async (req, res) => {
  const { message, history, challengeMode } = req.body;

  try {
    // Dynamically swap the AI's personality based on the toggle!
    const activeContext = challengeMode ? CHALLENGE_CONTEXT : PORTFOLIO_CONTEXT;

    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: "You are the personal AI assistant for Badal Vasava, a Full-Stack Engineer and Systems Architect. Your job is to enthusiastically discuss his skills in React, Node.js, PostgreSQL, and AppSheet, as well as his background managing complex logistics data at Zomato and Xpressbees. Keep your answers concise, professional, and conversational. Do not repeat the same phrases. If the user asks a technical question, answer it intelligently to prove Badal's technical competence.",
  generationConfig: {
    temperature: 0.8, // 0.0 is boring/repetitive, 1.0 is highly creative
  }
});

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    res.json({ reply: response.text() });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI failed to process the request' });
  }
});

module.exports = router;