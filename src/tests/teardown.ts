import { cleanUsers } from "./fixtures/seedUsers";

export default async () => {
  await cleanUsers();
};
