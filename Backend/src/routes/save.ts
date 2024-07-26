import express from "express";
import { textLongStUpdate, textLongStSelect } from "@/components/mysql";

const router = express.Router();

router.get("/", async (_, res) => {
  const sel = await textLongStSelect();
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ res: sel }));
});

router.post("/", async (req, res) => {
  const { text } = req.body;
  const result = await textLongStUpdate(text);
  res.setHeader("content-type", "application/json");
  if (result) {
    res.end(JSON.stringify({ res: true }));
  } else {
    res.end(JSON.stringify({ res: false }));
  }
});

export default router;
