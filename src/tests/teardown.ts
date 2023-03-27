import { cleanData } from "./fixtures/seedData";

export default async () => {
  await cleanData();
  delete globalThis.__TESTDATA__;
};
