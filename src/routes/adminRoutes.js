import { deleteUser, getAllUsers, getStats } from "../controllers/adminControllers.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";
// import { authorizeAdmin } from "../middleware/authorizeAdmin.js";
import { Router } from "express";


const router = Router();

router.get('/users', getAllUsers);
router.delete('/user:id', deleteUser);
router.get('/stats', getStats);


export default router;