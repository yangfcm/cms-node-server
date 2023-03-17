import { userJohn, userMike } from "./user";
import { createUser } from "../../repositories/user";

const seedUsers = async () => {
  await createUser(userJohn);
  await createUser(userMike);
};

export default seedUsers;
