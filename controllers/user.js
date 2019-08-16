/**
 * CRUD operations for User model
 */
const _ = require('lodash');
const User = require('../models/user');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');

const testUser = (req, res) => {
	res.send('User router works!');
};

const user404 = {
	name: "404",
	code: 404,
	message: "The user doesn't exist"
};


/**
 * Create a new user
 */
const createUser = async(req, res) => {
	const user = new User({
		email: req.body.email,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		username: req.body.username,
		password: req.body.password,
		createdAt: moment().unix(),
		updatedAt: moment().unix() 
	});
	try {
		await user.save();
		res.send(user);
	} catch(e) {
		res.status(400).send(e);
	}
};

/**
 * Read all users
 */
const readUsers = async(req, res) => {
	try {
		const users = await User.find();
		res.send({
			data: users
		});
	} catch(e) {
		res.status(400).send(e);
	}
};

/**
 * Read one user by id
 */
const readOneUser = async(req, res) => {
	const { id } = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(user404);
	}
	try {
		const user = await User.findById(id);
		if(user) {
			res.send({
				data: user
			});
		} else {
			res.status(404).send(user404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
};

/**
 * Delete a user permanently by id
 */
const deleteUser = async(req, res) => {
	const { id } = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(user404);
	}
	try {
		const user = await User.findByIdAndRemove(id);
		if(user) {
			res.send({
				data: user
			});
		} else {
			res.status(404).send(user404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
};

/**
 * Update a user with id
 */
const updateUser = async(req, res) => {
	const { id } = req.params; 

	if(!ObjectID.isValid(id)) {
		return res.status(404).send(user404);
	}

	const updateFields = Object.keys(req.body);
	const newUser = _.pick(req.body, 
		['email', 
		'firstname', 
		'lastname',
		'username',
		'password',
		'avatar',
		'status'
		]);

	try {
		const user = await User.findById(id);

		if(!user) {
			return res.status(404).send(user404);
		} 
		updateFields.forEach((field) => {
			if(newUser[field]) user[field] = newUser[field];
		});
		user.updatedAt = moment().unix();

		await user.save();
		res.status(200).send(user);
	} catch(e) {
		res.status(400).send(e);
	}
};


module.exports = { 
	testUser,
	createUser,
	readUsers,
	readOneUser,
	deleteUser,
	updateUser
};