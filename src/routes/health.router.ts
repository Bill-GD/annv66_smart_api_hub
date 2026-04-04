import express from 'express';
import HealthController from '../controllers/health.controller';

const router = express.Router();

router.get('/', HealthController.index);

export default router;
