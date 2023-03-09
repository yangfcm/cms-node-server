import { UserSignupData, UserSigninData, UserData } from "src/dtos/user";
import User from "src/models/user";

export const createUser = async (user: UserSignupData): Promise<UserData> => {
  const { email, username, password } = user;
  console.log(email, username, password);

  const newUser = new User(user);
  await newUser.save();
  return newUser.mapToUserData();
};
