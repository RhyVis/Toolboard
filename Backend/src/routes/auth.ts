import express from 'express';
import { auth } from '@/components/auth';
import { linkMap } from '@/bin/server';

const router = express.Router();

router.get('/', (req, res) => {
  res.end('No GET Support');
});

router.post('/', (req, res) => {
  let { token } = req.body;
  let authResult = auth(token);
  res.end(JSON.stringify({ res: authResult }));
});

router.post('/trans', (req, res) => {
  let reqKey = req.body.token as string;
  let authResult = auth(reqKey);
  let deeplToken = process.env.DEEPLTOKEN || 'NOTSET';
  let deeplEndpoint = linkMap.dplx;
  if (!deeplToken) {
    console.log('Warning: no deepl token set')
  }
  if (authResult) {
    res.end(JSON.stringify({ res: {
      token: deeplToken,
      endpoint: deeplEndpoint
    } }));
  } else {
    res.end(JSON.stringify({ res: undefined }));
  }
})

export default router;
