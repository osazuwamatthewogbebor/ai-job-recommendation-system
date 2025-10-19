import { fetchJobs } from '../services/jobRecommendationService.js';
import {getTopJobs, main } from '../utils/llmConnect.js';

async function recommendJobs(userProfile) {
    
    const llmResponse = await main(userProfile);
    const { query, location, filters } = llmResponse;
    //const country = location.split(', ').pop(); 
    let jobs = await fetchJobs(query, "Nigeria");
    //if (filters.remote) {
   //     jobs = jobs.filter(job => job.remote === true);
    //}
    //if (filters.employment_type) {
    //    jobs = jobs.filter(job => job.employment_type === filters.employment_type);
    //}
    return jobs;

    const topJobs = getTopJobs(jobs, 5);
    console.log('Top Jobs:', topJobs);
   // return topJobs;
  
}


export { recommendJobs };
