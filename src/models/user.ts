import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { isValidCharacters, isValidEmail } from "../utils/validators";
import { USER } from "../settings/constants";
import { UserData } from "../dtos/user";

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
      validate: [
        {
          validator: (value: string) => isValidEmail(value),
          message: USER.INVALID_EMAIL,
        },
        {
          async validator(value: string): Promise<boolean> {
            const model = this.constructor as Model<Document>;
            const existingUser = await model.findOne({ email: value });
            return !existingUser;
          },
          message: USER.EMAIL_IN_USE,
        },
      ],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, USER.USERNAME_REQUIRED],
      maxlength: [USER.MAX_USERNAME_LENGTH, USER.USERNAME_TOO_LONG],
      validate: [
        {
          validator: (value: string) => isValidCharacters(value),
          message: USER.INVALID_USERNAME,
        },
        {
          async validator(value: string): Promise<boolean> {
            const model = this.constructor as Model<Document>;
            const existingUser = await model.findOne({ username: value });
            return !existingUser;
          },
          message: USER.USERNAME_IN_USE,
        },
      ],
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

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

userSchema.methods.mapToUserData = function (): UserData {
  const user = this;
  return {
    id: user._id,
    email: user.email,
    username: user.username,
    nickname: user.nickname,
    biography: user.biography,
    avatar: user.avatar,
  };
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
