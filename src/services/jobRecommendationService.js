import  {DataTypes} from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from './User.js';
import Job from './job.js'; 

const Recommendation = sequelize.define("Recommendation", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  jobId: {
    type: DataTypes.INTEGER,
    references: {
      model: Job,
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Recommendation;

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
