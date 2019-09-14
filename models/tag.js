/**
 * Tag model
 * Tag model and Post model is many-to-many relationship 
 */

const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
		required: [true, 'Tag name is required'],
		maxlength: [20, 'Tag is too long'] 
	},
	createdAt: {
		type: Number,
		required: true,
		default: 0
	},
	updatedAt: {
		type: Number,
		required: true,
		default: 0
	}
});

const Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;