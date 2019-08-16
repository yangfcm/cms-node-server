const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	email: {		// Email - can be used for login
		type: String,
		required: [true, 'Email cannot be empty'],
		lowercase: true,
		unique: true,
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
		maxlength: [50, 'First name is too long'],
		default: ''
	},
	lastname: {
		type: String,
		required: [true, 'Last name is required'],
		trim: true,
		maxlength: [50, 'Last name is too long'],
		default: ''
	},
	username: {		// username - can be used for login
		type: String,
		required: [true, 'Username is required'],
		unique: true,
		trim: true,
		maxlength: [20, 'Username is too long']
	},
	password: {
		type: String,
		required: true
	},
	tokens: [{
    // access: {
    //   type: String,
    //   required: true
    // },
    token: {
      type: String,
      required: true
    }
  }],
	avatar: {
		type: String
	},
	status: {		// 0 - inactive, 1 - active 
		type: Number,
		required: true,
		default: 1	// For normal user, set active by default
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

/**
 * Hash password
 */
UserSchema.pre('save', async function(next) {
  const user =this;

  if(user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8); 
	}
});

/**
 * Hide sensitive data, like password and tokens in API
 */
UserSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.tokens;
	return userObject;
}

/**
 * Remove token
 */
UserSchema.methods.removeToken = async function(token) {
	const user = this;
	if(!token) {
		user.tokens = [];
	} else {
		user.tokens = user.tokens.filter((item) => {
			return item.token !== token;
		});
	}
	await user.save();
}

/**
 * Validate user's email and password
 */
UserSchema.statics.findByCredentials = async function(email, password) {
	const User = this;
  const user = await User.findOne({ email });

  if(!user) {
    throw new Error('Bad credentials: Fail to login');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) {
    throw new Error('Bad credentials: Fail to login');
  }
  return user; 
}

/**
 * Generate JWT auth token
 */
UserSchema.methods.generateAuthToken = async function() {
	const user = this;  // 'this' refers to user instance 
  const token = jwt.sign(
    { _id: user._id.toString() }, 
    process.env.JWT_SECRET,
    // { expiresIn: '7 days'}
  ).toString();

  user.tokens = user.tokens.concat([{
    token
  }]);

  await user.save();
  return token;
}


const User = mongoose.model('User', UserSchema);

module.exports = User;