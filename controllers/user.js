const User = require('../models/user');

const testUser = (req, res) => {
	res.send('User router works!');
};

module.exports = { 
	testUser 
};