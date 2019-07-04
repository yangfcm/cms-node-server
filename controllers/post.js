const Post = require('../models/post');

const testPost = (req, res) => {
	res.send('Post router works!');
};

module.exports = { 
	testPost 
};