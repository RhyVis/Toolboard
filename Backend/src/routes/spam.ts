import express from 'express';
import { fetchSpam } from '@/components/spam';

const router = express.Router();

router.get('/', async (_, res) => {
  let sri = await fetchSpam('min', '');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(sri);
});

router.post('/', async (req, res) => {
  const { body } = req;
  let sri = await fetchSpam(body.type, body.code, body.limit);
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ res: sri }));
});

export default router;
