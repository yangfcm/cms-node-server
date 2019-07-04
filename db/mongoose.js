const mongoose = require('mongoose');
require('../config/config.js');

// const mongodbURI = 'mongodb://127.0.0.1:27017/cms';

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useCreateIndex: true
});

module.exports = mongoose;