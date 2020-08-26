import express from 'express';
import { paymentsController } from '../controllers';
import { asyncHandler } from '../middleware';

const router = express.Router();

router
  .get('/payments/users', asyncHandler(paymentsController.getAllPayments))
  .get('/payments', asyncHandler(paymentsController.preparePayments))
  .post('/payments', asyncHandler(paymentsController.sendPayments))
  .put('/payments', asyncHandler(paymentsController.checkPayments));

export default router;
