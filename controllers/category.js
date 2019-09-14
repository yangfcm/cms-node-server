/**
 * CRUD operations for Category model
 */
const _ = require('lodash');
const Category = require('../models/category');
const Post = require('../models/post');
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
		const count = await Category.countDocuments({ name: category.name });
		if(count >= 1) {
			return res.status(400).send({message: 'Category name already exists'});
		}
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
		const count = await Post.countDocuments({ category: id });
		if(count >= 1) {
			return res.status(400).send({message: 'There is one or more post existing under there category'});
		}
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
		const oldCategory = await Category.findById(id);
		if(!oldCategory) {
			return res.status(404).send(category404);
		}
		if(oldCategory.name === newCategory.name.trim().toLowerCase()) {
			// If old category's name equals to new category's name, delete name property
			delete newCategory.name;
		} else {
			// Otherwise check if new category's name equals to other categories
			const count = await Category.countDocuments({ name: newCategory.name });
			if(count >= 1) {
				return res.status(400).send({message: 'Category name already exists'});
			} 
		}		
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