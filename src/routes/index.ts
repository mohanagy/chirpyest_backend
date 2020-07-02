import express from 'express';
import affiliateNetworks from './affiliateNetworks';
import auth from './auth';
import helloWorld from './helloWorld';

const router = express.Router();

router.use('/affiliate-networks', affiliateNetworks);
router.use('/', [helloWorld]);
router.use('/api/v1/', [auth]);

export default router;
