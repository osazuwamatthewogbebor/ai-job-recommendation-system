import { DataTypes } from "sequelize";  
import sequelize from "../config/sequelize.js";

const User = sequelize.define("User", { 
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
 otpTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },

}, {
  timestamps: true,
});


export default User;
