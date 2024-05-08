import express from "express";
import {
  codexEmoji,
  codexUnidiff,
  codexTrad,
  codexSpark,
} from "@/components/codex";

const router = express.Router();

router.get("/", (_, res) => {
  const test = codexEmoji("玩玩抽象差不多得了", false);
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(test);
});

router.post("/", (req, res) => {
  const { body } = req;
  const { type, text } = body;
  let result: string;
  switch (type) {
    case "nmsl":
      result = codexEmoji(text, body.dec);
      break;
    case "unic":
      result = codexUnidiff(text);
      break;
    case "trad":
      result = codexTrad(text, body.dec);
      break;
    case "sprk":
      result = codexSpark(text, body.dec);
      break;
    default:
      result = text;
      break;
  }
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ res: result }));
});

export default router;
