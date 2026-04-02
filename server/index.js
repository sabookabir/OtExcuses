import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main AI Generation routes
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Overthinker Pro Max Backend is savage and alive 💀' });
});

app.listen(PORT, () => {
    console.log(`💀 Server running on port ${PORT}`);
});
