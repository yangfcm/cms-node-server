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
    foundUser = await User.findOne({ email: identity }).populate('blogs');
  }
  if (isValidCharacters(identity)) {
    foundUser = await User.findOne({ username: identity }).populate('blogs');
  }
  if (!foundUser) return null;

  const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordMatch) return null;

  return foundUser.mapToUserData();
};

export const readUserById = async (id: string): Promise<UserData | null> => {
  const user = await User.findById(id).populate('blogs');
  return user ? user.mapToUserData() : null;
};

export const updateUser = async (id: string, user: Partial<UserData>): Promise<UserData | null> => {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      $set: user,
    },
    {
      runValidators: true,
      returnDocument: "after",
    }
  );
  if (!updatedUser) return null;
  return updatedUser.mapToUserData();
}