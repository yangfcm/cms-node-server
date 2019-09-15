/**
 * CRUD operations for Post model
 */
const _ = require('lodash');
const Post = require('../models/post');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');

const testPost = (req, res) => {
	res.send('Post router works!');
};

const post404 = {
	name: "404",
	code: 404,
	message: "The post doesn't exist"
};

const createPost = async(req, res) => {
	const newPost = new Post({
		title: req.body.title,
		content: req.body.content,
		featuredImage: req.body.featuredImage,
		createdAt: moment().unix(),
		updatedAt: moment().unix(),
		author: req.body.author,
		category: req.body.category,
		tags: req.body.tags
	});

	try {
		const post = await newPost.save();
		return res.status(200).send({
			data: post
		});
	} catch(e) {
		res.status(400).send(e);
	}
};

const readPosts = async(req, res) => {
	try {
		const posts = 
			await Post.find({}, 'title featuredImage status isTop createdAt updatedAt category tags author')
								.populate('author', '_id email firstname lastname username avatar')
								.populate('category', '_id name description')
								.populate('tags', '_id name')
								.exec();
		res.send({
			data: posts
		});
	} catch(e) {
		res.status(400).send(e);
	}
};

const readOnePost = async(req, res) => {
	const { id } = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(post404);
	}

	try {
		const post = 
			await Post.findById(id)
								.populate('author', '_id email firstname lastname username avatar')
								.populate('category', '_id name description')
								.populate('tags', '_id name')
								.exec();
		if(post) {
			res.send({ 
				data: post 
			});
		} else {
			res.status(404).send(post404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
}

const deletePost = async(req, res) => {
	const { id } = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(post404);
	}
	try {
		const post = await Post.findByIdAndRemove(id);
		if(post) {
			res.send({
				data: post
			});
		} else {
			res.status(404).send(post404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
}

const updatePost = async(req, res) => {
	const { id } = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(post404);
	}
	const newPost = _.pick(req.body, [
		'title',
		'content',
		'featuredImage',
		'status',
		'isTop',
		'author',
		'category',
		'tags'
	]);
	newPost.updatedAt = moment().unix(); 

	try {
		const post = await Post.findByIdAndUpdate(
			id,
			newPost,
			{new: true, runValidators: true}
		);
		if(post) {
			res.send({ data: post });
		} else {
			res.status(404).send(post404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
}

module.exports = { 
	testPost,
	createPost,
	readPosts,
	readOnePost,
	deletePost,
	updatePost
};