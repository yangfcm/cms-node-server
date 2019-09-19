/**
 * CRUD operations for Post model
 */
const _ = require("lodash");
const Post = require("../models/post");
const ObjectID = require("mongodb").ObjectID;
const moment = require("moment");

const { POSTS_PER_PAGE } = require("../config/settings");

const testPost = (req, res) => {
  res.send("Post router works!");
};

const post404 = {
  name: "404",
  code: 404,
  message: "The post doesn't exist"
};

const createPost = async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    featuredImage: req.body.featuredImage,
    createdAt: moment().unix(),
    updatedAt: moment().unix(),
    author: req.body.author,
    category: req.body.category,
    tags: req.body.tags,
    isTop: req.body.isTop,
    status: req.body.status
  });

  try {
    const post = await newPost.save();
    return res.status(200).send({
      data: post
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

const readPosts = async (req, res) => {
  // page - currrent page 1 by default
  // sort -
  console.log(req.query);
  const { all, status, page } = req.query;
  /** all - 'all' | null, if all='all' No pagination, return all posts at once */
  /** page - number, return the posts at the specified page, if not specified, return the posts on first page */
  /** status - number, 0 or other value, return all posts regardless of its status, 1, only returns published posts  */
  const filter = {}; // The filter to select posts
  const options = {};
  const sort = { isTop: -1, updatedAt: -1, createdAt: -1 };

  if (status == 1) {
    filter.status = "1";
  }

  try {
    if (all === "all") {
      // Return posts data without pagination
      const posts = await Post.find(
        filter,
        "title featuredImage status isTop createdAt updatedAt category tags author"
      )
        .populate("author", "_id email firstname lastname username avatar")
        .populate("category", "_id name description")
        .populate("tags", "_id name")
        .sort(sort)
        .exec();
      return res.send({
        data: posts
      });
    }

    // Now consider pagination.
    const postTotalCounts = await Post.countDocuments(filter); // Total number of posts
    console.log(postTotalCounts);
    const currentPage = Number(page) || 1;
    console.log(currentPage);
    const totalPages = Math.ceil(postTotalCounts / POSTS_PER_PAGE);
    console.log(totalPages);

    const meta = {
      // The information about pagination
      currentPage,
      totalPages,
      itemsPerPage: POSTS_PER_PAGE
    };
    meta.prevPage = meta.currentPage <= 1 ? null : meta.currentPage - 1;
    meta.nextPage =
      meta.currentPage >= meta.totalPages ? null : meta.currentPage + 1;

    options.limit = meta.itemsPerPage;
    options.skip = (meta.currentPage - 1) * meta.itemsPerPage;

    const posts = await Post.find(
      filter,
      "title featuredImage status isTop createdAt updatedAt category tags author",
      options
    )
      .populate("author", "_id email firstname lastname username avatar")
      .populate("category", "_id name description")
      .populate("tags", "_id name")
      .sort({ isTop: -1, updatedAt: -1, createdAt: -1 })
      .exec();
    res.send({
      meta,
      data: posts
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

const readOnePost = async (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send(post404);
  }

  try {
    const post = await Post.findById(id)
      .populate("author", "_id email firstname lastname username avatar")
      .populate("category", "_id name description")
      .populate("tags", "_id name")
      .exec();
    if (post) {
      res.send({
        data: post
      });
    } else {
      res.status(404).send(post404);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send(post404);
  }
  try {
    const post = await Post.findByIdAndRemove(id);
    if (post) {
      res.send({
        data: post
      });
    } else {
      res.status(404).send(post404);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send(post404);
  }
  const newPost = _.pick(req.body, [
    "title",
    "content",
    "featuredImage",
    "status",
    "isTop",
    "author",
    "category",
    "tags"
  ]);
  newPost.updatedAt = moment().unix();

  try {
    const post = await Post.findByIdAndUpdate(id, newPost, {
      new: true,
      runValidators: true
    })
      .populate("author", "_id email firstname lastname username avatar")
      .populate("category", "_id name description")
      .populate("tags", "_id name")
      .exec();
    if (post) {
      res.send({ data: post });
    } else {
      res.status(404).send(post404);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  testPost,
  createPost,
  readPosts,
  readOnePost,
  deletePost,
  updatePost
};
