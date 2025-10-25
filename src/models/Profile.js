import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  isRemotePreferred: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  job_titles: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  preferred_location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'profiles',
  timestamps: true,
});

Profile.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

export default Profile;
