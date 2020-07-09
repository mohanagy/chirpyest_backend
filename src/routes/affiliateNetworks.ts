import express from 'express';
import { affiliateNetworksController } from '../controllers';
import { getImpactRadiusWebhookData } from '../controllers/impactRaduis';
import { asyncHandler } from '../middleware';

const router = express.Router();

router.get('/affiliate-networks/rakuten/webhook', asyncHandler(affiliateNetworksController.getRakutenWebhookData));
router.get('/affiliate-networks/impact-radius/webhook', asyncHandler(getImpactRadiusWebhookData));

export default router;
