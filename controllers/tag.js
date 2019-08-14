/**
 * CRUD operations for Tag model
 */
const _ = require('lodash');
const Tag = require('../models/tag');
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
		await tag.save();
		res.send(tag);
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