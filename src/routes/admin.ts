import express from 'express';
import { affiliateNetworksController, usersControllers } from '../controllers';
import { verifyToken, asyncHandler, validate } from '../middleware';
import { UserTypes } from '../interfaces';
import * as adminController from '../controllers/admin';
import { brandsValidation } from '../validations';

const router = express.Router();

router
  .get('/admin/users', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.getUsersList))
  .get('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.getUser))
  .patch('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.updateUser))
  .delete('/admin/users/:id', asyncHandler(verifyToken([UserTypes.Admin])), asyncHandler(usersControllers.deleteUser));

router.get(
  '/admin/brands',
  asyncHandler(verifyToken([UserTypes.Admin])),
  asyncHandler(affiliateNetworksController.getBrandsForAdmin),
);

router.delete(
  '/admin/brands/:id',
  asyncHandler(verifyToken([UserTypes.Admin])),
  asyncHandler(affiliateNetworksController.deleteBrandsForAdmin),
);

router.patch(
  '/admin/brands/:id',
  asyncHandler(verifyToken([UserTypes.Admin])),
  validate.body(brandsValidation.updateBrandNameBody),
  asyncHandler(affiliateNetworksController.updateBrandNameForAdmin),
);

router.get(
  '/admin/revenues',
  asyncHandler(verifyToken([UserTypes.Admin])),
  asyncHandler(adminController.revenuesService.getTotalRevenues),
);

router.get(
  '/admin/revenues/closed',
  asyncHandler(verifyToken([UserTypes.Admin])),
  asyncHandler(adminController.revenuesService.getClosedRevenues),
);

export default router;
