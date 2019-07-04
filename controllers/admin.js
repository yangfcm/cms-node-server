const Admin = require('../models/admin');

const testAdmin = (req, res) => {
	res.send('Admin router works!');
};

module.exports = { 
	testAdmin 
};