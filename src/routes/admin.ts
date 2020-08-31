import express from 'express';
import { affiliateNetworksController, usersControllers } from '../controllers';

import { asyncHandler, verifyToken } from '../middleware';
import { UserTypes } from '../interfaces';

const router = express.Router();

router
  .get('/admin/users', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.getUsersList))
  .patch('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.updateUser))
  .delete('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.deleteUser));

router.get('/admin/brands', asyncHandler(affiliateNetworksController.getBrandsForAdmin));
export default router;
