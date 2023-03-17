import request from "supertest";
import app from "../app";
import { readUserById } from "../repositories/user";
import { newUserMary, userJohn } from "./fixtures/user";
import { AUTH, USER } from "../settings/constants";

describe("Test auth routers", () => {
  test("sign up new user successfully.", async () => {
    const {
      header,
      body: { user: createdUser },
    } = await request(app).post("/api/auth/signup").send(newUserMary);

    // Assert token is available.
    const token = header["x-auth"];
    expect(token).toBeDefined();

    // Assert created user is the user to sign up.
    // const { user: createdUser } = response.body as AuthUserResponse;
    expect(createdUser).not.toBeNull();
    expect(createdUser.username).toBe(newUserMary.username);
    expect(createdUser.nickname).toBe(newUserMary.nickname);
    expect(createdUser.email).toBe(newUserMary.email);

    // Assert user is persisted in db.
    const user = await readUserById(createdUser.id);
    expect(user).toEqual(createdUser);
  });

  test("Sign up with existing email and username", async () => {
    {
      const {
        body: { message },
        status,
      } = await request(app).post("/api/auth/signup").send({
        email: userJohn.email, // Existing email.
        username: "Josh",
        password: "abcd1234",
      });
      expect(status).toBe(400);
      expect(message).toMatch(USER.EMAIL_IN_USE);
    }

    {
      const {
        body: { message },
        status,
      } = await request(app).post("/api/auth/signup").send({
        email: "josh@test.com",
        username: userJohn.username, // Existing username.
        password: "abcd1234",
      });
      expect(status).toBe(400);
      expect(message).toMatch(USER.USERNAME_IN_USE);
    }
  });

  test("sign in user with email successfully", async () => {
    const {
      header,
      body: { user },
    } = await request(app).post("/api/auth/signin").send({
      identity: userJohn.email,
      password: userJohn.password,
    });

    const token = header["x-auth"];
    expect(token).toBeDefined();

    expect(user.username).toBe(userJohn.username);
    expect(user.email).toBe(userJohn.email);
  });

  test("sign in user with username successfully", async () => {
    const {
      header,
      body: { user },
    } = await request(app).post("/api/auth/signin").send({
      identity: userJohn.username,
      password: userJohn.password,
    });

    const token = header["x-auth"];
    expect(token).toBeDefined();

    expect(user.username).toBe(userJohn.username);
    expect(user.email).toBe(userJohn.email);
  });

  test("sign in user with bad credentials", async () => {
    // Sign in with bad password.
    {
      const {
        body: { message },
        status: status,
      } = await request(app).post("/api/auth/signin").send({
        identity: userJohn.email,
        password: "bad",
      });
      expect(status).toBe(403);
      expect(message).toMatch(AUTH.BAD_CREDENTIALS);
    }

    // Sign in with non existing email.
    {
      const {
        body: { message },
        status,
      } = await request(app).post("/api/auth/signin").send({
        identity: "not_exist@test.com",
        password: userJohn.password,
      });
      expect(status).toBe(403);
      expect(message).toMatch(AUTH.BAD_CREDENTIALS);
    }
  });
});
