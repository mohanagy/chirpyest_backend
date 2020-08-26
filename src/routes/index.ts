import express from 'express';
import affiliateNetworks from './affiliateNetworks';
import auth from './auth';
import financialDashboard from './financialDashboard';
import helloWorld from './helloWorld';
import payments from './payments';
import users from './users';
import admin from './admin';

const router = express.Router();

router.use('/', [helloWorld]);
router.use('/api/v1/', [auth, users, affiliateNetworks, financialDashboard, payments, admin]);

export default router;
