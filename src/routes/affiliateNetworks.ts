import express from 'express';
import { UserTypes } from '../interfaces';
import { affiliateNetworksController } from '../controllers';
import { asyncHandler, validate, verifyToken } from '../middleware';
import { brandsValidation } from '../validations';

const router = express.Router();

router.get('/affiliate-networks/rakuten/webhook', asyncHandler(affiliateNetworksController.getRakutenWebhookData));
router.get(
  '/affiliate-networks/impact-radius/webhook',
  asyncHandler(affiliateNetworksController.getImpactRadiusWebhookData),
);
router.post(
  '/affiliate-networks/commission-junction/webhook',
  asyncHandler(affiliateNetworksController.getCommissionJunction),
);

router.get(
  '/affiliate-networks/brands',
  validate.query(brandsValidation.brandsQuery),
  asyncHandler(affiliateNetworksController.getBrands),
);
router.post(
  '/brands/shortLinks',
  asyncHandler(verifyToken([UserTypes.Customer])),
  validate.body(brandsValidation.shortLinksValidate),
  asyncHandler(affiliateNetworksController.shortLinks),
);

export default router;
