/**
 * CRUD operations for Tag model
 */
const _ = require('lodash');
const Tag = require('../models/tag');
const Post = require('../models/post');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');

const testTag = (req, res) => {
	res.send('Tag router works!');
};

const tag404 = {
	name: "404",
	code: 404,
	message: "The tag doesn't exist"
};

const createTag = async (req, res) => {
	const tag = new Tag({
		name: req.body.name,
		createdAt: moment().unix(),
		updatedAt: moment().unix()
	});
	try {
		const count = await Tag.countDocuments({name: tag.name});
		if(count >= 1) {
			return res.status(400).send({message: 'Tag name already exists'});
		}
		await tag.save();
		res.send({data: tag});
	} catch(e) {
		res.status(400).send(e);
	}
};

const readTags = async (req, res) => {
	try {
		const tags = await Tag.find();
		res.send({ data: tags });
	} catch(e) {
		res.status(400).send(e);
	}
};

const readOneTag = async (req, res) => {
	const { id } = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(tag404)
	}
	try {
		const tag = await Tag.findById(id);
		if(tag) {
			res.send({ data: tag });
		} else {
			res.status(404).send(tag404)
		}
	} catch(e) {
		res.status(400).send(e);
	}
};

const deleteTag = async (req, res) => {
	const { id } = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(tag404)
	}
	try {
		const postFound = await Post.findOne({
			tags: { $in: [id] }
		})
		if(postFound) {
			return res.status(400).send({message: 'There is one or more posts existing under the tag name'})
		}
		const tag = await Tag.findByIdAndRemove(id);
		if(tag) {
			res.send({ data: tag });
		} else {
			res.status(404).send(tag404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
};

const updateTag = async (req, res) => {
	const { id } = req.params;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send(tag404)
	}

	const newTag = _.pick(req.body, ['name']);
	newTag.updatedAt = moment().unix();

	try {
		const oldTag = await Tag.findById(id);
		if(!oldTag) {
			return res.status(404).send(tag404);
		}
		if(oldTag.name === newTag.name.trim().toLowerCase()) {
			// If old tag's name equals to new tag's name, delete name from newTag
			delete newTag.name;
		} else {
			// Otherwise check if new tag's name exists in other tags
			const count = await Tag.countDocuments({name: newTag.name});
			if(count >= 1) {
				return res.status(400).send({message: 'Tag name already exists'});
			}
		}
		const tag = await Tag.findByIdAndUpdate(
			id, 
			newTag, 
			{new: true, runValidators: true}
		);
		if(tag) {
			res.send({data: tag});
		} else {
			res.status(404).send(tag404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
};

module.exports = { 
	testTag,
	createTag,
	readTags,
	readOneTag,
	deleteTag,
	updateTag
};