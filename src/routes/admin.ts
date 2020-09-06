import express from 'express';
import { affiliateNetworksController, usersControllers } from '../controllers';

import { asyncHandler, verifyToken } from '../middleware';
import { UserTypes } from '../interfaces';
import * as adminController from '../controllers/admin';

const router = express.Router();

router
  .get('/admin/users', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.getUsersList))
  .get('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.getUser))
  .patch('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.updateUser))
  .delete('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.deleteUser));

router.get('/admin/brands', asyncHandler(affiliateNetworksController.getBrandsForAdmin));

router.get(
  '/admin/revenues',
  asyncHandler(verifyToken([UserTypes.Admin])),
  asyncHandler(adminController.revenuesService.getTotalRevenues),
);

export default router;
