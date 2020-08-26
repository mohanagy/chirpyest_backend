import express from 'express';
import { UserTypes } from '../interfaces';
import { financialDashboardController } from '../controllers';
import { asyncHandler, verifyToken } from '../middleware';

const router = express.Router();

router.get(
  '/users/:id/financial-dashboard',
  asyncHandler(verifyToken([UserTypes.Customer])),
  asyncHandler(financialDashboardController.getUserFinancialData),
);

export default router;
