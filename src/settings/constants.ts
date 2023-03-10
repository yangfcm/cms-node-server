// Config constants from environment variables.
export const DATABASE_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI || "";
export const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_do_not_use_it_in_production";

// Constants for schemas.
export const CATEGORY = {
  NAME_REQUIRED: "Category name is required.",
  MAX_NAME_LENGTH: 20,
  NAME_TOO_LONG: "Category name is too long.",
  MAX_DESCRIPTION_LENGTH: 100,
  DESCRIPTION_TOO_LONG: "Category description is too long.",
};

export const USER = {
  EMAIL_REQUIRED: "Email is required.",
  INVALID_EMAIL: "The given email is invalid.",
  EMAIL_IN_USE: "The email is already in use",
  USERNAME_REQUIRED: "Username is required",
  INVALID_USERNAME: "Username contains invalid characters",
  MAX_USERNAME_LENGTH: 20,
  USERNAME_TOO_LONG: "Username is too long",
  USERNAME_IN_USE: "The username is already in use",
  MAX_NICKNAME_LENGTH: 50,
  NICKNAME_TOO_LONG: "Nickname is too long",
};

export const AUTH = {
  BAD_CREDENTIALS: "Bad credentials",
  INVALID_TOKEN: "Invalid token",
  MISSING_TOKEN: "Missing token",
  EXPIRED_TOKEN: "Expired token",
};
