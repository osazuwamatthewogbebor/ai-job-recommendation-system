import User from "../models/User.js";
import Profile from "../models/Profile.js"
import { Op } from "sequelize";
import logger from "../config/logger.js";

export const getAllUsersServices = async () => {
    try {
        const users = await User.findAll({ include: [Profile]});
        if (!users) return null;

        return users;
    } catch (error) {
        logger.error(error.message);
    };
};

export const deleteUserService = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) return null;

        return user;
    } catch (error) {
        logger.error(error.message);   
    };
};

export const getStatsService = async () => {
    try {
        // User stats
        const totalUsers = await User.count();

        const verifiedUsers = await User.count({
            where: { verified: true},
        });

        const unverifiedUsers = await User.count({
            where: { verified: false},
        });

        // Profile stats
        const totalProfiles = await Profile.count();

        const profilesWithImage = await Profile.count({
            where: {
                profileImageUrl: { [Op.not]: null },
            },
        });

        const profilesWithoutImage = await Profile.count({
            where: {
                profileImageUrl: null,
            },
        });
        
        const profilesWithResume = await Profile.count({
            where: {
                resumeUrl: { [Op.not]: null },
            },
        });

        const profilesWithoutResume = await Profile.count({
            where: {
                resumeUrl: null,
            },
        });

         return {
                    success: true,
                    message: "Admin statistics retrieved successfully",
                    stats: {
                        users: {
                            total: totalUsers,
                            verified: verifiedUsers,
                            unverified: unverifiedUsers,
                        },
                        profiles: {
                            total: totalProfiles,
                            withImage: profilesWithImage,
                            withoutImage: profilesWithoutImage,
                            withResume: profilesWithResume,
                            withoutResume: profilesWithoutResume,
                        },
                    },
                };


    } catch (error) {
        logger.error("Error fetching admin stats:", error);
    };
};