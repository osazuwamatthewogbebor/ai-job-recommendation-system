import express from 'express';
import { jobController } from '../controllers/jobControllers.js';


const router = express.Router();

router.get('/', jobController);

export default router;
