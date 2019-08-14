const mongoose = require('mongoose');
const User = require('./user');

const AdminSchema = new mongoose.Schema({
	status: {
		type: Number,
		required: true,
		default: 0		// For admin, set inactive by default
	},
	role: {
		type: Number,
		required: true,
		default: 1
	}
});

const Admin = User.discriminator('Admin', AdminSchema);

module.exports = Admin;