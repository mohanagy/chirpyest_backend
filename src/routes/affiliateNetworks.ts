import express from 'express';
import { affiliateNetworksController } from '../controllers';
import { asyncHandler } from '../middleware';

const router = express.Router();

router.get('/affiliate-networks/rakuten/webhook', asyncHandler(affiliateNetworksController.getRakutenWebhookData));
router.get(
  '/affiliate-networks/impact-radius/webhook',
  asyncHandler(affiliateNetworksController.getImpactRadiusWebhookData),
);

export default router;
