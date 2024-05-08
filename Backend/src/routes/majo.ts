import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.sendStatus(404);
  res.end("No GET Request Support");
});

router.post("/", (req, res) => {
  res.end({ res: "NONE" });
});

export default router;
