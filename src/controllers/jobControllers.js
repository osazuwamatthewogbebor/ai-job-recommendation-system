import { fetchJobs } from '../services/jobRecommendationService.js';
import { main } from '../utils/llmConnect.js';
import emailService from '../services/emailService.js';

async function recommendJobs(userProfile) {
    try {
        const llmResponse = await main(userProfile);
    const { query, country, filters } = llmResponse;
    //const country = location.split(', ').pop(); 
    let jobs = await fetchJobs(query, country, 1);
    //if (filters.remote) {
   //     jobs = jobs.filter(job => job.remote === true);
    //}
    //if (filters.employment_type) {
    //    jobs = jobs.filter(job => job.employment_type === filters.employment_type);
    //}
    emailService.sendRecommendedJobsEmail(userProfile.email, 'Your Job Recommendations', userProfile.name, JSON.stringify(jobs));
    return jobs;
    } catch (error) {
        console.error('Error in recommendJobs:', error.message);
        throw error;
    }
}


export { recommendJobs };
