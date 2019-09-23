const Comment = require("../models/comment");
const Post = require("../models/post");
const ObjectID = require("mongodb").ObjectID;
const moment = require("moment");
const _ = require("lodash");
const { COMMENTS_PER_PAGE } = require("../config/settings");

const testComment = (req, res) => {
  res.send("Comment router works!");
};

const post404 = {
  name: "404",
  code: 404,
  message: "The post doesn't exist"
};

const comment404 = {
  name: "404",
  code: 404,
  message: "The comment doesn't exist"
};

const createComment = async (req, res) => {
  const { postId } = req.body;
  if (!ObjectID.isValid(postId)) {
    return res.status(404).send(post404);
  }

  const author = {};
  author.firstName = req.body.firstName;
  author.lastName = req.body.lastName;
  author.email = req.body.email;

  const newComment = new Comment({
    content: req.body.content,
    author,
    post: req.body.postId,
    createdAt: moment().unix(),
    updatedAt: moment().unix()
  });

  try {
    const postCount = Post.findById(postId).estimatedDocumentCount();
    if (!postCount) {
      // Check if the post with postId exists
      res.status(404).send(post404);
    }

    const comment = await newComment.save();
    return res.status(200).send({
      data: comment
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

/** Read all comments once in database, only for admin purpose */
const readComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("post", "_id, title")
      .sort({ isRead: 1, isTop: -1, createdAt: -1, updatedAt: -1 })
      .exec();
    res.send({ data: comments });
  } catch (e) {
    res.status(400).send(e);
  }
};

/** Read comments under a post with post id */
const readCommentsByPost = async (req, res) => {
  const { id } = req.params; // id here is post id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send(post404);
  }

  const { page } = req.query;
  const filter = { status: "1", post: id };
  const sort = { isTop: -1, createdAt: -1, updatedAt: -1 };
  const options = {};
  try {
    if (!page) {
      // If page not specified, return all comments under the post(No pagination)
      const comments = await Comment.find(filter)
        .populate("post", "_id, title")
        .sort(sort)
        .exec();
      return res.send({
        data: comments
      });
    } else {
      // Now consider pagination
      const commentTotalCounts = await Comment.countDocuments(filter); // total number of comments
      const currentPage = Number(page) || 1;
      const totalPages = Math.ceil(commentTotalCounts / COMMENTS_PER_PAGE);
      const meta = {
        // Information about pagination
        currentPage,
        totalPages,
        itemsPerPage: COMMENTS_PER_PAGE
      };
      meta.prevPage = meta.currentPage <= 1 ? null : meta.currentPage - 1;
      meta.nextPage =
        meta.currentPage >= meta.totalPages ? null : meta.totalPages + 1;
      options.limit = meta.itemsPerPage;
      options.skip = (meta.currentPage - 1) * meta.itemsPerPage;

      const comments = await Comment.find(filter, "", options)
        .populate("post", "_id, title")
        .sort(sort)
        .exec();
      res.send({
        meta,
        data: comments
      });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

/** Read one comment by id */
const readOneComment = async (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send(comment404);
  }
  try {
    const comment = await Comment.findById(id)
      .populate("post", "_id, title")
      .exec();
    if (comment) {
      res.send({
        data: comment
      });
    } else {
      res.status(404).send(comment404);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send(comment404);
  }

  try {
    const comment = await Comment.findByIdAndRemove(id);
    if (comment) {
      res.send({ data: comment });
    } else {
      res.status(404).send(comment404);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send(comment404);
  }
  try {
    const newComment = _.pick(req.body, [
      "content",
      "status",
      "isRead",
      "isTop"
    ]);
    newComment.updatedAt = moment().unix();
    const comment = await Comment.findByIdAndUpdate(id, newComment, {
      new: true,
      runValidators: true
    })
      .populate("post", "_id, title")
      .exec();
    if (comment) {
      res.send({ data: comment });
    } else {
      res.status(404).send(comment404);
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = {
  testComment,
  createComment,
  readComments,
  readCommentsByPost,
  readOneComment,
  updateComment,
  deleteComment
};
