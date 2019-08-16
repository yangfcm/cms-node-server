/**
 * CRUD operations for Admin model
 */
const _ = require('lodash');
const Admin = require('../models/admin');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');

const testAdmin = (req, res) => {
	res.send('Admin router works!');
};

const admin404 = {
	name: "404",
	code: 404,
	message: "The admin doesn't exist"
}

/**
 * Create a new admin
 */
const createAdmin = async(req, res) => {
	const admin = new Admin({
		email: req.body.email,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		username: req.body.username,
		password: req.body.password,
		role:  req.body.role,
		createdAt: moment().unix(),
		updatedAt: moment().unix() 
	});
	try {
		await admin.save();
		res.send(admin);
	} catch(e) {
		res.status(400).send(e);
	}
};

/**
 * Read all admins
 */
const readAdmins = async(req, res) => {
	try {
		const admins = await Admin.find();
		res.send({
			data: admins
		});
	} catch(e) {
		res.status(400).send(e);
	}
};

/**
 * Read an admin by id
 */
const readOneAdmin = async(req, res) => {
	const { id } = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(admin404);
	}
	try {
		const admin = await Admin.findById(id);
		if(admin) {
			res.send({
				data: admin
			});
		} else {
			res.status(404).send(admin404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
};

/**
 * Delete an admin permanently by id
 */
const deleteAdmin = async(req, res) => {
	const { id } = req.params;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send(admin404);
	}
	try {
		const admin = await Admin.findByIdAndRemove(id);
		if(admin) {
			res.send({
				data: admin
			});
		} else {
			res.status(404).send(admin404);
		}
	} catch(e) {
		res.status(400).send(e);
	}
};

/**
 * Update an admin with id
 */
const updateAdmin = async(req, res) => {
	const { id } = req.params;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send(admin404);
	}

	const updateFields = Object.keys(req.body);
	const newAdmin = _.pick(req.body, 
		['email', 
		'firstname', 
		'lastname',
		'username',
		'password',
		'avatar',
		'status',
		'role'
		]);

	try {
		const admin = await Admin.findById(id);
		if(!admin) {
			return res.status(404).send(admin404);
		}

		updateFields.forEach((field) => {
			if(newAdmin[field])	admin[field] = newAdmin[field];
		});
		admin.updatedAt = moment().unix();

		await admin.save();
		res.status(200).send(admin);
	} catch(e) {
		res.status(400).send(e);
	}
};

module.exports = {
	testAdmin,
	createAdmin,
	readAdmins,
	readOneAdmin,
	deleteAdmin,
	updateAdmin
}