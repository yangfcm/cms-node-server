import "./appConfig";

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
  NAME_IN_USE: "The category already exists.",
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

export const BLOG = {
  MAX_TITLE_LENGTH: 50,
  TITLE_TOO_LONG: "Blog title is too long.",
  TITLE_REQUIRED: "Title is required.",
  ADDRESS_REQUIRED: "Address is required.",
  INVALID_ADDRESS: "Address contains invalid characters.",
  ADDRESS_IN_USE: "Address is already in use.",
  NO_ACCESS_TO_BLOG: "You cannot access the blog",
  NOT_FOUND: "Blog not found",
};

export const ARTICLE = {
  TITLE_REQUIRED: "Article title is required.",
  TITLE_TOO_LONG: "Article title is too long",
  MAX_TITLE_LENGTH: 200,
};

export const TAG = {
  NAME_REQUIRED: "Tag name is required.",
  MAX_NAME_LENGTH: 20,
  NAME_TOO_LONG: "Tag name is too long.",
  NAME_IN_USE: "The tag already exists.",
};

export const COMMENT = {
  CONTENT_REQUIRED: "Comment content is required.",
  MAX_CONTENT_LENGTH: 500,
  CONTENT_TOO_LONG: "Comment content is too long.",
};

export const ONE_DAY_IN_SECONDS = 24 * 60 * 60;
