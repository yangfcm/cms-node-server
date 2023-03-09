import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { isValidCharacters, isValidEmail } from "src/utils/validators";
import { USER } from "src/settings/constants";

// A user is a person who owns a blog platform and he/she can access the functions like commenting, following, being followed etcs.
interface IUser extends Document {
  email: string;
  username: string;
  nickname: string;
  biography: string;
  avatar: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, USER.EMAIL_REQUIRED],
      minlength: [0, USER.EMAIL_REQUIRED],
      validate: {
        validator: (value: string) => isValidEmail(value),
        message: USER.INVALID_EMAIL,
      },
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, USER.USERNAME_REQUIRED],
      minlength: [0, USER.USERNAME_REQUIRED],
      maxlength: [USER.MAX_USERNAME_LENGTH, USER.USERNAME_TOO_LONG],
      validate: {
        validator: (value: string) => isValidCharacters(value),
        message: USER.INVALID_USERNAME,
      },
    },
    nickname: {
      type: String,
      trim: true,
      maxlength: [USER.MAX_NICKNAME_LENGTH, USER.NICKNAME_TOO_LONG],
    },
    biography: {
      type: String,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
