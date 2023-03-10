import bcrypt from "bcryptjs";
import { UserSignupData, UserSigninData, UserData } from "../dtos/user";
import User, { IUser } from "../models/user";
import { isValidEmail, isValidCharacters } from "../utils/validators";

export const createUser = async (user: UserSignupData): Promise<UserData> => {
  const newUser = new User(user);
  await newUser.save();
  return newUser.mapToUserData();
};

export const findUserByCredentials = async (
  user: UserSigninData
): Promise<UserData | null> => {
  const { identity, password } = user;
  let foundUser: IUser | null = null;
  if (isValidEmail(identity)) {
    foundUser = await User.findOne({ email: identity });
  }
  if (isValidCharacters(identity)) {
    foundUser = await User.findOne({ username: identity });
  }
  if (!foundUser) return null;

  const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordMatch) return null;

  return foundUser.mapToUserData();
};
