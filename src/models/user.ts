import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { isValidCharacters, isValidEmail } from "src/utils/validators";
import { USER } from "src/settings/constants";
import { UserData } from "src/dtos/user";

// A user is a person who owns a blog platform and he/she can access the functions like commenting, following, being followed etcs.
export interface IUser extends Document {
  email: string;
  username: string;
  nickname: string;
  biography: string;
  avatar: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  mapToUserData: () => UserData;
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

userSchema.methods.mapToUserData = function (): UserData {
  const user = this;
  return {
    id: user._id,
    username: user.username,
    nickname: user.nickname,
    biography: user.biography,
    avatar: user.avatar,
  };
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
