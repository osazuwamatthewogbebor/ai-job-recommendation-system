import express from 'express';
import { jobController } from '../controllers/jobControllers.js';


const router = express.Router();

router.post('/', jobController);

export default router;
