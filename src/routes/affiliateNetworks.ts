import express from 'express';
import { affiliateNetworksController } from '../controllers';
import { asyncHandler } from '../middleware';

const router = express.Router();

router.get('/rakuten/webhook', asyncHandler(affiliateNetworksController.getRakutenWebhookData));

export default router;
