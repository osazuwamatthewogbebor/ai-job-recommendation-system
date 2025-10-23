import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";

const Profile = sequelize.define("Profile", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  skills: {
    type: DataTypes.JSON,
  },
  experience: {
    type: DataTypes.STRING,
  },
  resume: {
    type: DataTypes.STRING,
  },
});

Profile.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

export default Profile;
