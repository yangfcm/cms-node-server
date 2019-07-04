/**
 * Tag model
 * Tag model and Post model is many-to-many relationship 
 */

const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: [true, 'The tag already exists'],
		trime: true,
		maxlength: [20, 'Tag is too long'] 
	},
	createdAt: {
		type: Number,
		required: true
	},
	updatdAt: {
		type: Number,
		required: true
	}
});

const Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;