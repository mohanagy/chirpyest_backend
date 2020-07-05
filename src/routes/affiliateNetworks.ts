import express from 'express';
import { affiliateNetworksController } from '../controllers';

const router = express.Router();

router.get('/affiliate-networks/rakuten/webhook', affiliateNetworksController.getRakutenWebhookData);

export default router;
