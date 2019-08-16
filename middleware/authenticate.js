const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');

const requireUserLogin = async(req, res, next) => {
	try {
		if(!req.header('x-auth')) {
			throw new Error('Invalid credential'); 
		}
		const token = req.header('x-auth').replace('Bearer ', '');
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token
		});
		if(!user) {
			throw new Error('Invalid credential');
		}
		req.user = user;
		next();
	} catch(e) {
		res.status(401).send({
			name: "401",
			code: 401,
			message: 'User authentication failed: ' + e.message
		});
	}
};

const requireAdminLogin = async(req, res, next) => {
	try {
		if(!req.header('x-auth')) {
			throw new Error('Invalid credential'); 
		}
		const token = req.header('x-auth').replace('Bearer ', '');
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const admin = await Admin.findOne({
			_id: decoded._id,
			__t: 'Admin',
			'tokens.token': token
		});
		if(!admin) {
			throw new Error('Invalid credential');
		}
		req.admin = admin;
		next();
	} catch(e) {
		res.status(401).send({
			name: "401",
			code: 401,
			message: 'Admin authentication failed: ' + e.message
		})
	}
};

module.exports = {
	requireUserLogin,
	requireAdminLogin
}