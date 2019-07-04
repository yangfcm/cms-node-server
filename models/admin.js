const mongoose = require('mongoose');
const validator = require('validator');

const AdminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Email cannot be empty'],
		lowercase: true,
		unique: [true, 'This email is already taken.'],
		trim: true,
		validate: {
			validator: (value) => validator.isEmail(value),
			message: (props) => `${props.value} is not a valid email.`
		}
	},
	firstname: {
		type: String,
		required: [true, 'First name is required'],
		trim: true,
		maxlength: [50, 'First name is too long']
	},
	lastname: {
		type: String,
		required: [true, 'Last name is required'],
		trim: true,
		maxlength: [50, 'Last name is too long']
	},
	username: {
		type: String,
		required: [true, 'Username is required'],
		trim: true,
		maxlength: [20, 'Username is too long']
	},
	password: {
		type: String,
		required: true
	},
	tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
	avatar: {
		type: String
	},
	createdAt: {
		type: Number,
		required: true
	},
	updatedAt: {
		type: Number,
		required: true
	}
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;