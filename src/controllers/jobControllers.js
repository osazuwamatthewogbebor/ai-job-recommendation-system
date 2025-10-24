import { fetchJobs } from '../services/jobRecommendationService.js';
import { main, analyzeJobs } from '../utils/llmConnect.js';
import Profile from '../models/Profile.js';
import emailService from '../services/emailService.js';

async function recommendJobs(userProfile) {
  try {
    const llmResponse = await main(userProfile);
    const { query, preferred_location, work_from_home, country } = llmResponse;
    let jobs = await fetchJobs(query, country, work_from_home, 1);

    if (!jobs || jobs.length === 0) {
      return { success: true, top_jobs: [], message: "No jobs found." };
    }
    const analyzed = await analyzeJobs(userProfile, jobs);
    
    const mergedResults = jobs.map(job => {
  const analysis = analyzed?.top_jobs?.find(a => a.job_id === job.job_id);

  return {
    job_id: job.job_id,
    title: job.job_title || job.title || "Unknown Title",
    company: job.employer_name || "Unknown Company",
    location: job.job_city || job.job_country || "Unknown Location",
    link: job.job_apply_link || job.url || "",
    match_score: analysis ? analysis.match_score : 0,
    reason: analysis ? analysis.reason : "No analysis available."
  };
});

    mergedResults.sort((a, b) => b.match_score - a.match_score);

    await emailService.sendRecommendedJobsEmail(
      "example@gmail.com",//Pls put recipient email here
      'Your Job Recommendations',
      userProfile.name,
      JSON.stringify(jobs)
    );
    return { 
        success: true, 
        message: "Job recommendations fetched successfully, Check your email!",
    };
  } catch (error) {
    console.error('Error in recommendJobs:', error);
    throw error;
  }
}

export { recommendJobs };

