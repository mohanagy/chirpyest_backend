import express from 'express';
import { QueryTypes } from 'sequelize';
import { dbConfig } from '../database';

const router = express.Router();

interface TimeNow {
  now: Date;
}

router.get('/hello-world', async (req, res) => {
  const [timeNow]: Array<TimeNow> = await dbConfig.query('SELECT NOW();', { type: QueryTypes.SELECT });
  res.send(`Hello, World! ${timeNow.now.toLocaleString()}`);
});

export default router;
