import { DATABASE_CONNECTION_URI } from "../settings/constants";
import connectDatabase from "../settings/connectDatabase";
import { seedData, cleanData } from "./fixtures/seedData";

export default async () => {
  await connectDatabase(DATABASE_CONNECTION_URI);
  await cleanData();
  await seedData();
};
