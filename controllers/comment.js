const Comment = require('../models/comment');

const testComment = (req, res) => {
	res.send('Comment router works!');
};

module.exports = { 
	testComment 
};