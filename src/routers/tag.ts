import { Router, Request, Response } from "express";

const router = Router();

router.get("/check", (req, res) => {
  res.send("Tag router is working.");
});

export default router;
