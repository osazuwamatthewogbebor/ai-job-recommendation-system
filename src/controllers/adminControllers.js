import { deleteUserService, getAllUsersServices, getSingleUserService, getStatsService } from "../services/adminService.js";


export const getAllUsers = async (req, res) => {
    const users = await getAllUsersServices();
    if (!users) return res.status(500).json({ message: "Error fetching all users"});

    res.status(200).json({ success: true, message: "All users retrieved", users});
};

export const getSingleUser = async (req, res) => {
    const { id } = req.params;
    const user = await getSingleUserService(id);
    if (!user) return res.status(404).json({ message: "User does not exist"});

    res.status(200).json({ success: true, message: "User detail retrieved", user});
};

export const deleteUser = async (req, res) => {
    const { id } = req.params
    const user = await deleteUserService(id);

    if (!user) return res.status(404).json({ message: "Invalid parameter "});

    res.status(200).json({ success: true, message: `User ${id} deleted successfully`});
};

export const getStats = async (req, res) => {
    const stats = await getStatsService();

    if (!stats) return res.status(500).json({ message: "Error fetching statistics" });

    return res.status(200).json({ success: true, message: "Smart AI Jobber stats fetched successfully", stats});
};

