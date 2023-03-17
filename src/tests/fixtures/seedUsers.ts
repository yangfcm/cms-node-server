import { userJohn, userMike } from "./user";
import { createUser } from "../../repositories/user";
import User from "../../models/user";

export const seedUsers = async () => {
  await createUser(userJohn);
  await createUser(userMike);
};

export const cleanUsers = async () => {
  const count = await User.estimatedDocumentCount();
  if (count > 0) {
    await User.deleteMany();
  }
};
