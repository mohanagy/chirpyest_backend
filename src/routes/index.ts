import express from 'express';
import affiliateNetworks from './affiliateNetworks';

const router = express.Router();

// /api/v1/affiliate-networks
router.use('/affiliate-networks', affiliateNetworks);

export default router;
