import express from 'express';
import { usersControllers } from '../controllers';
import { asyncHandler, verifyToken } from '../middleware';
import { UserTypes } from '../interfaces';

const router = express.Router();

router
  .get('/admin/users', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.getUsersList))
  .get('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.getUser))
  .patch('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.updateUser))
  .delete('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.deleteUser));

export default router;
