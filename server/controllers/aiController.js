import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Create Gemini Client
// The @google/genai library automatically picks up GEMINI_API_KEY from environment variables
const ai = new GoogleGenAI({});

export const generateOverthink = async (req, res) => {
    try {
        const { situation, mode } = req.body;

        let tone = "You are a dramatic, chronic overthinker from Gen-Z.";
        if (mode === 'toxic') tone = "You are a toxic, extremely suspicious internet user who assumes the worst.";
        if (mode === 'delusional') tone = "You are completely delusional, thinking everything is a sign that they are obsessed with you.";
        if (mode === 'motivational') tone = "You are aggressively motivational but in a slightly manic way, gaslighting them into positivity.";

        const prompt = `${tone} Provide exactly 5 highly exaggerated, meme-worthy overthinking thoughts for the following situation: "${situation}". Format as a numbered list. Be funny, modern, and use some emojis.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ output: response.text });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'AI is overthinking right now. Try again.' });
    }
};

export const generateExcuse = async (req, res) => {
    try {
        const { situation, tone } = req.body;
        
        const prompt = `You are a Gen-Z meme excuse generator. The user needs an excuse for: "${situation}". 
        Tone requested: ${tone || 'savage'}
        Provide 2 excuses: 
        1. "The Believable One 😇" (actually usable but slightly dramatic)
        2. "The Savage One 💀" (hilarious, unhinged, meme-worthy, completely unapologetic).
        Format clearly with those headers and use emojis.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ output: response.text });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Could not generate excuse. You are on your own.' });
    }
};

export const generateCombo = async (req, res) => {
    try {
        const { situation } = req.body;

        const prompt = `You are a funny Gen-Z chaotic life coach. The user is in this situation: "${situation}".
        Give me a unified response with:
        1. 🧠 "The Overthink" (1 dramatic worst-case scenario thought)
        2. 💀 "The Excuse" (1 savage excuse to get out of it)
        3. 🔮 "The Advice" (1 funny but weirdly profound piece of Gen-Z advice).
        Keep it concise, meme-like, and use emojis.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ output: response.text });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Combo failed.' });
    }
};
