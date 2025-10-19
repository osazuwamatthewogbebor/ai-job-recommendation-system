import express from 'express';
import jobController from '../controllers/jobController.js';  
const router = express.Router();
import { recommendJobs } from '../controllers/jobControllers.js';
import { fetchJobs } from '../services/jobRecommendationService.js';
import logger from '../config/logger.js';


// Example endpoint: POST /api/recommend
router.post('/recommend', async (req, res) => {
  try {
    const userProfile = req.body;
    const jobs = await recommendJobs(userProfile);
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
