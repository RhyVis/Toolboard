import express from "express";
import { auth, authHash } from "@/components/auth";
import { linkMap } from "@/bin/server";

const router = express.Router();

router.get("/", (_, res) => {
  res.end("No GET Support");
});

router.post("/", (req, res) => {
  let { value, hash } = req.body;
  let authResult: boolean;
  if (hash) {
    authResult = authHash(value);
  } else {
    authResult = auth(value);
  }
  res.end(JSON.stringify({ res: authResult }));
});

router.post("/trans", (req, res) => {
  let { value, hash } = req.body;
  let authResult;
  if (hash) {
    authResult = authHash(value);
  } else {
    authResult = auth(value);
  }
  if (authResult) {
    res.end(
      JSON.stringify({
        res: {
          token: process.env.DEEPLTOKEN || "NOTSET",
          endpoint: linkMap.dplx,
        },
      })
    );
  } else {
    res.end(JSON.stringify({ res: undefined }));
  }
});

export default router;
