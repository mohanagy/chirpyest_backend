import express from 'express';

const router = express.Router();

router.get('/hello-world', (req, res) => {
  res.send('Hello, World!');
});

export default router;
