/**
 * Post model
 */
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	title: {		// Post title
		type: String,
		required: [true, 'Title is required'],
		trim: true,
		maxlength: [50, 'Title is too long'] 
	},
	content: {	// Post content
		type: String,
		required: [true, 'Content is required']
	},
	featuredImage: String,	// Post's featured image
	status: {		// Post status: 1 - published, 2 - draft, 3 - trashed
		type: String,
		enum: ['1', '2', '3'],
		required: true,
		default: '2'
	},
	isTop: {		// If the post is always on the top
		type: Boolean,
		required: true,
		default: false
	},
	createdAt: {		// When the post is created
		type: Number,
		required: true,
	},
	updatedAt: {	// When the post is updated
		type: Number,
		required: true
	},
	author: {		// Author
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Admin'
	},
	category: {
    type: mongoose.Schema.Types.ObjectId,
		required: true,
    ref: 'Category'
	},
	tags: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Tag',
		default: []
	},
	comments: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Comment',
		default: []
	}
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;