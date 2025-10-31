import User from "./User.js";
import Profile from "./Profile.js";

User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

export { User, Profile };