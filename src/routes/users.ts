import express from 'express';
import { UserTypes } from '../interfaces';
import { usersControllers } from '../controllers';
import { asyncHandler, validate, verifyToken } from '../middleware';
import { usersValidation } from '../validations';

const router = express.Router();

router.get('/users/reminder', asyncHandler(usersControllers.sendReminderToUseChirpyest));
router.get(
  '/users/:id/profile',
  asyncHandler(verifyToken([UserTypes.Customer])),
  asyncHandler(usersControllers.getUserProfile),
);
router.patch(
  '/users/:id/profile',
  asyncHandler(verifyToken([UserTypes.Customer])),
  validate.body(usersValidation.updateUserProfile),
  asyncHandler(usersControllers.updateUserProfile),
);

export default router;
