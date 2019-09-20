const express = require("express");
const commentController = require("../../controllers/comment");
const { requireAdminLogin } = require("../../middleware/authenticate");

const router = new express.Router();

router.get("/comments/test", commentController.testComment);
router.get("/comments", requireAdminLogin, commentController.readComments);
router.get("/comments/post/:id", commentController.readCommentsByPost);
router.get("/comments/:id", commentController.readOneComment);
router.post("/comments", commentController.createComment);
router.patch(
  "/comments/:id",
  requireAdminLogin,
  commentController.updateComment
);
router.delete(
  "/comments/:id",
  requireAdminLogin,
  commentController.deleteComment
);

module.exports = router;
