import request from "supertest";
import app from "../app";
import { readUserById } from "../repositories/user";
import { newUserMary, userJohn, userMike } from "./fixtures/user";
import { AUTH, USER } from "../settings/constants";
import { mikeBlog1, mikeBlog2 } from "./fixtures/blog";

describe("Test auth routers", () => {
  test("sign up new user successfully.", async () => {
    const {
      body: { user: createdUser, token },
    } = await request(app).post("/api/auth/signup").send(newUserMary);

    // Assert token is available.
    expect(token).toBeDefined();

    // Assert created user is the user to sign up.
    expect(createdUser.id).toBeDefined();
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
      body: { user, token },
    } = await request(app).post("/api/auth/signin").send({
      identity: userJohn.email,
      password: userJohn.password,
    });

    expect(token).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.username).toBe(userJohn.username);
    expect(user.email).toBe(userJohn.email);
  });

  test("sign in user with username successfully", async () => {
    const {
      body: { user, token },
    } = await request(app).post("/api/auth/signin").send({
      identity: userJohn.username,
      password: userJohn.password,
    });

    expect(token).toBeDefined();
    expect(user.id).toBeDefined();
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

  test('exchange user data with token', async () => {
    const { userMikeToken } = globalThis.__TESTDATA__;

    const { body: { user } } = await request(app).get('/api/auth/token')
      .set("x-auth", userMikeToken);
    console.log(user.blogs);
    expect(user.id).toBeDefined();
    expect(user.email).toBe(userMike.email);
    expect(user.username).toBe(userMike.username);
    expect(user.nickname).toBe(userMike.nickname);
    expect(user.biography).toBe(userMike.biography);
    expect(user.blogs.length).toBe(2);
    expect(user.blogs[0]).toMatchObject(mikeBlog1);
    expect(user.blogs[1]).toMatchObject(mikeBlog2);
  });
});
