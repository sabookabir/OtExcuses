import express from 'express';
import { generateOverthink, generateExcuse, generateCombo } from '../controllers/aiController.js';

const router = express.Router();

router.post('/overthink', generateOverthink);
router.post('/excuse', generateExcuse);
router.post('/combo', generateCombo);

export default router;
