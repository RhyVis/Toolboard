import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    const t = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/version.json'), { encoding: 'utf-8' }))
    res.end(JSON.stringify(t));
  } catch (e) {
    console.error(e);
    res.end(JSON.stringify({ res: { compileTime: 'ERROR' } }));
  }
})

export default router;
