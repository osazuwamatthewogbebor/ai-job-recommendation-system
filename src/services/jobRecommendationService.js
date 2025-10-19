import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

async function fetchJobs(query, country, page = 1) {
  try {
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: { query, country, page },
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    return [];
  }
}

export {fetchJobs}; 
