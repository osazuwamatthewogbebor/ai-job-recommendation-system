import express from 'express';
const router = express.Router();
import { recommendJobs } from '../controllers/jobControllers.js';
import { fetchJobs } from '../services/jobRecommendationService.js';
import logger from '../config/logger.js';
import Profile from '../models/Profile.js';


router.post('/', async (req, res) => {
   try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }
    const userProfile = await Profile.findOne({ where: { id } });

    if (!userProfile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    const profileData = userProfile.get({ plain: true });
    const jobs = await recommendJobs(profileData);

    res.status(200).json(jobs);

  } catch (err) {
    console.error('Error in /api/recommend:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
