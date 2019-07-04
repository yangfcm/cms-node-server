/**
 * Category model
 * A category model and a post model is a one-to-many relationship
 */
const mongoose = require('mongoose'); 

const CategorySchema = new mongoose.Schema({
	name: {		// Category name
		type: String,
		unique: [true, 'The category already exists'],
		required: [true, 'Category name is required'],
		trim: true
	},
	description: {		// Category description
		type: String,
		trim: true
	},
	createdAt: {		// Timestamp of creation time
		type: Number,
		required: true
	},
	updatedAt: {		// Timestamp of update time
		type: Number,
		required: true
	}
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;