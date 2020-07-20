import express from 'express';
import { financialDashboardController } from '../controllers';
import { asyncHandler, verifyToken } from '../middleware';

const router = express.Router();

router.get(
  '/user/:id/financial-dashboard',
  asyncHandler(verifyToken),
  asyncHandler(financialDashboardController.getUserFinancialData),
);

export default router;
