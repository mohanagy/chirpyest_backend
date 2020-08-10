import express from 'express';
import { paymentsController } from '../controllers';
import { asyncHandler } from '../middleware';

const router = express.Router();

router
  .get('/payments', asyncHandler(paymentsController.preparePayments))
  .post('/payments', asyncHandler(paymentsController.sendPayments));

export default router;
