const Category = require('../models/category');

const testCategory = (req, res) => {
	res.send('Category router works!');
};

module.exports = { 
	testCategory 
};