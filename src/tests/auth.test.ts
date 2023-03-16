import request from "supertest";
import app from "../app";
import User from "../models/user";

import { userMary } from "./fixtures/user";

describe("Test auth functions", () => {
  beforeAll(async () => {
    await User.deleteMany();
  });

  it("should be able to sign up new user.", async () => {
    const response = await request(app).post("/api/auth/signup").send(userMary);
    const user = await User.findById(response.body.id);
    expect(user).not.toBeNull();
    expect(response.body.username).toBe(user?.username);
  });
});
