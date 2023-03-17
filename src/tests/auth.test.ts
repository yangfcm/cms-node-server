import request from "supertest";
import app from "../app";
import { UserData } from "../dtos/user";
import User from "../models/user";
import { readUserById } from "../repositories/user";
import { userMary } from "./fixtures/user";

describe("Test auth functions", () => {
  beforeAll(async () => {
    await User.deleteMany();
  });

  test("sign up new user.", async () => {
    const response = await request(app).post("/api/auth/signup").send(userMary);

    // Assert token is available.
    const token = response.header["x-auth"];
    expect(token).toBeDefined();

    // Assert created user is the user to sign up.
    const createdUser: UserData = response.body;
    expect(createdUser).not.toBeNull();
    expect(createdUser.username).toBe(userMary.username);
    expect(createdUser.nickname).toBe(userMary.nickname);
    expect(createdUser.email).toBe(userMary.email);

    // Assert user is persisted in db.
    const user = await readUserById(createdUser.id);
    expect(user).not.toBeNull();
    expect(user).toEqual(createdUser);
  });
});
