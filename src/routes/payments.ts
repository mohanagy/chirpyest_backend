import express from 'express';
import { paymentsController } from '../controllers';
import { asyncHandler } from '../middleware';

const router = express.Router();

router.get('/payments', asyncHandler(paymentsController.preparePayments));

export default router;
