import { Router, Request, Response } from "express";

const router = Router();

router.get("/check", (req, res) => {
  res.send("Comment router is working.");
});

export default router;
