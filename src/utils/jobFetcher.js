import axios from 'axios';
import APP_CONFIG from '../config/APP_CONFIG.js';
import logger from '../config/logger.js';


async function fetchJobs(query, country, work_from_home, page = 1) {
  try {
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: { query, country, work_from_home, date_posted: 'month', page },
      headers: {
        'X-RapidAPI-Key': APP_CONFIG.JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });
    return response.data.data;
  } catch (error) {
    logger.error('Error fetching jobs:', error.message);
    return [];
  }
}

export {fetchJobs}; 
