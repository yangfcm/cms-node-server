import { Router, Request, Response } from "express";

const router = Router();

router.get("/check", (req, res) => {
  res.send("Comment router is working.");
});

/**
 * Post a comment
 */
router.post("/", (req, res) => {});

/**
 * Get one comment
 */
router.get("/:id", (req, res) => {});

/**
 * Get all comments for a blog
 * Get comments for an article.
 */
router.get("/", (req, res) => {});

/**
 * Update a comment
 */
router.put("/:commentId", (req, res) => {});

/**
 * Delete a comment
 */
router.delete("/:commentId", (req, res) => {});

export default router;
