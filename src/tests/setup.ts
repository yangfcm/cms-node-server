import { DATABASE_CONNECTION_URI } from "../settings/constants";
import connectDatabase from "../settings/connectDatabase";
import { seedUsers, cleanUsers } from "./fixtures/seedUsers";

export default async () => {
  await connectDatabase(DATABASE_CONNECTION_URI);
  // await cleanUsers();
  await seedUsers();
};
