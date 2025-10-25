import { fetchJobs } from '../services/jobRecommendationService.js';
import { main, analyzeJobs } from '../utils/llmConnect.js';
import emailService from '../services/emailService.js';
import cacheManager from '../utils/cacheManager.js';

async function recommendJobs(userProfile) {

  try {

    // Get job query from llm
    const llmResponse = await cacheManager.getFetchSetCache(`jobs:query:ai:user:${userProfile.id}`, main(userProfile), 600); 

    const { query, preferred_location, work_from_home, country } = llmResponse;
    
    // Fetch jobs
    const jobs = await cacheManager.getFetchSetCache(`jobs:fetched:api:user:${userProfile.id}`, fetchJobs(query, country, work_from_home, 1) ,600);

    if (!jobs || jobs.length === 0) {
      return { success: true, top_jobs: [], message: "No jobs found." };
    }

    // Job analysis
    const analyzed = await cacheManager.getFetchSetCache(`jobs:analysis:ai:user:${userProfile.id}`, analyzeJobs(userProfile, jobs), 600);
    
    // Merged jobs recommended
    const mergedResults = cacheManager.getFetchSetCache(
      `jobs:recommended:merged:user:${userProfile.id}`, 
      () => {
        const results = jobs.map(job => {
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
        return results.sort((a, b) => b.match_score - a.match_score);
      },
      600
    );

    await emailService.sendRecommendedJobsEmail(
      userProfile.email || "example@gmail.com", // Pls put recipient email here
      'Your Job Recommendations',
      userProfile.name,
      JSON.stringify(mergedResults)
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

