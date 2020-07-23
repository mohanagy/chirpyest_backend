import express from 'express';
import { QueryTypes } from 'sequelize';
import { dbConfig } from '../database';
import { TimeNow } from '../interfaces/Time';

const router = express.Router();

router.get('/hello-world', async (_req, res) => {
  const [timeNow]: Array<TimeNow> = await dbConfig.query('SELECT NOW();', { type: QueryTypes.SELECT });
  res.send(`Hello, World! ${timeNow.now.toLocaleString()}`);
});

export default router;
