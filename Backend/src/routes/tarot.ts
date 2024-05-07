import express from 'express';
import { drawTarot, CardPick } from '@/components/tarot';

const router = express.Router();

router.get('/', (_, res) => {
  res.setHeader('content-type','application/json; charset=utf-8');
  res.sendStatus(404);
  res.end('No GET Request Support');
});

router.post('/', (req, res) => {
  const { deck, type, count } = req.body;
  let picked: CardPick[];
  switch (deck) {
    case 'waite': {
      picked = drawTarot(type ? 'waite' : 'waite_main', count);
      break;
    }
    case 'bilibili': {
      picked = drawTarot(type ? 'bilibili' : 'bilibili_main', count);
      break;
    }
    case 'bluearchive': {
      picked = drawTarot('bluearchive', count);
      break;
    }
    case 'arknights': {
      picked = drawTarot('arknights', count);
      break;
    }
    default: {
      picked = drawTarot('waite', count);
      break;
    }
  }
  const result = JSON.stringify({ res: picked });
  res.setHeader('content-type','application/json; charset=utf-8'); 
  res.end(result);
})

export default router;
