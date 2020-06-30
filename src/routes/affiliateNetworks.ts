import express from 'express';
import { affiliateNetworksController } from '../controllers';
import { asyncHandler } from '../middleware';

const router = express.Router();

router.get('/webhooks/rakuten', asyncHandler(affiliateNetworksController.getRakutenWebhookData));

export default router;
