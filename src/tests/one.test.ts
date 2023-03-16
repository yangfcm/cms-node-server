import { DATABASE_CONNECTION_URI } from "../settings/constants";

test("first test", () => {
  console.log(DATABASE_CONNECTION_URI);
  expect(1 + 2).toBe(3);
});
