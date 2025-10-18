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
