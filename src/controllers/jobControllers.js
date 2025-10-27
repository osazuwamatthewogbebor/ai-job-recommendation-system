import logger from "../config/logger.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import emailService from "../services/emailService.js";
import { recommendJobs } from "../services/jobRecommendationService.js";


export const jobController = async (req, res) => {
   try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }
    const userProfile = await Profile.findOne({ 
      where: { userId } ,
      include: [{
        model: User,
        attributes: ['name', 'email'],
      }]
    });

    if (!userProfile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    const profileData = userProfile.get({ plain: true });
    const jobs = await recommendJobs(profileData);

    // Send recommended jobs to email
    await emailService.sendRecommendedJobsEmail(
      userProfile?.User?.email || "example@gmail.com", // Pls put recipient email here
      'Your Job Recommendations',
      userProfile?.User?.name || "User",
      JSON.stringify(jobs)
    );

    res.status(200).json(
      { 
        success: true, 
        message: "Job recommendations fetched successfully, Check your email!",
        jobs
    }
    );

  } catch (err) {
    logger.error('Error in /api/recommend:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}