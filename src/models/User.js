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
  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
 otpTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  verified: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false,
},

}, {
  timestamps: true,
});


export default User;
