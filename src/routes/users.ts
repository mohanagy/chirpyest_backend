import express from 'express';
import { usersControllers } from '../controllers';
import { asyncHandler, validate, verifyToken } from '../middleware';
import { usersValidation } from '../validations';

const router = express.Router();

router.get('/users/:id/profile', asyncHandler(verifyToken), asyncHandler(usersControllers.getUserProfile));
router.patch(
  '/users/:id/profile',
  asyncHandler(verifyToken),
  validate.body(usersValidation.updateUserProfile),
  asyncHandler(usersControllers.updateUserProfile),
);

export default router;
