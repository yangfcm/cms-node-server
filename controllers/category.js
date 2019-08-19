/**
 * CRUD operations for Category model
 */
const _ = require('lodash');
const Category = require('../models/category');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');

const testCategory = (req, res) => {
	res.send('Category router works!');
};

const category404 = {
	name: "404",
	code: 404,
	message: "The category doesn't exist"
};

const createCategory = async (req, res) => {
	const category = new Category({
		name: req.body.name,
		description: req.body.description,
		createdAt: moment().unix(),
		updatedAt: moment().unix()
	});
	try {
		await category.save();
		res.send({data: category});
	} catch(e) {
		res.status(400).send(e);
	}
};

const readCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		res.send({data: categories});
	} catch(e) {
		res.status(400).send(e);
	}
};

const readOneCategory = async (req, res) => {
	const {id} = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(category404);
	}
	try {
		const category = await Category.findById(id);
		if(category) {
			res.send({ data: category });
		} else {
			res.status(404).send(category404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
};

const deleteCategory = async (req, res) => {
	const {id} = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(category404);
	}
	try {
		const category = await Category.findByIdAndRemove(id);
		if(category) {
			res.send({ data: category });
		} else {
			res.status(404).send(category404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
};

const updateCategory = async (req, res) => {
	const {id} = req.params;
	// const body = _.pick(req.body, ['task', 'description', 'completed', 'completedAt']);
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(category404);
	}
	const newCategory = _.pick(req.body, ['name', 'description']);
	newCategory.updatedAt = moment().unix();
	
	try {
		const category = await Category.findByIdAndUpdate(
			id,
			newCategory,
			{new: true, runValidators: true}
		);
		if(category) {
			res.send({ data: category });
		} else {
			res.status(404).send(category404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
};

module.exports = { 
	testCategory,
	createCategory,
	readCategories,
	readOneCategory,
	deleteCategory,
	updateCategory
};