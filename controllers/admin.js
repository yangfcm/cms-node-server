/**
 * CRUD operations for Admin model
 */
const _ = require("lodash");
const Admin = require("../models/admin");
const ObjectID = require("mongodb").ObjectID;
const moment = require("moment");

const testAdmin = (req, res) => {
  res.send("Admin router works!");
};

const admin404 = {
  name: "404",
  code: 404,
  message: "The admin doesn't exist"
};

/**
 * Create a new admin
 */
const createAdmin = async (req, res) => {
  const admin = new Admin({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
    status: req.body.status,
    createdAt: moment().unix(),
    updatedAt: moment().unix()
  });
  try {
    // Validate if there's duplicate username
    const countUsername = await Admin.countDocuments({
      username: admin.username
    });
    if (countUsername >= 1) {
      return res
        .status(400)
        .send({ message: `Username ${admin.username} is already taken` });
    }

    // Validate if there's duplicate email
    const countEmail = await Admin.countDocuments({
      email: admin.email
    });
    if (countEmail >= 1) {
      return res
        .status(400)
        .send({ message: `Email ${admin.email} is already taken` });
    }
    await admin.save();
    res.send({ data: admin });
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
 * Read all admins
 */
const readAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.send({
      data: admins
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
 * Read an admin by id
 */
const readOneAdmin = async (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send(admin404);
  }
  try {
    const admin = await Admin.findById(id);
    if (admin) {
      res.send({
        data: admin
      });
    } else {
      res.status(404).send(admin404);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
 * Read current login admin
 */
const readCurrentAdmin = (req, res) => {
  res.send({
    data: { admin: req.admin }
  });
};

/**
 * Delete an admin permanently by id
 */
const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send(admin404);
  }
  try {
    const admin = await Admin.findByIdAndRemove(id);
    if (admin) {
      res.send({
        data: admin
      });
    } else {
      res.status(404).send(admin404);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
 * Update an admin with id
 */
const updateAdmin = async (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send(admin404);
  }

  const updateFields = Object.keys(req.body);
  const newAdmin = _.pick(req.body, [
    "email",
    "firstname",
    "lastname",
    "username",
    "avatar",
    "status",
    "role"
  ]);

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).send(admin404);
    }

    const countUsername = await Admin.countDocuments({
      username: newAdmin.username
    });
    if (
      admin.username.trim().toLowerCase() !==
        newAdmin.username.trim().toLowerCase() &&
      countUsername >= 1
    ) {
      return res
        .status(400)
        .send({ message: `Username ${newAdmin.username} is already taken` });
    }

    // Validate if there's duplicate email
    const countEmail = await Admin.countDocuments({
      email: newAdmin.email
    });
    if (
      admin.email.trim().toLowerCase() !==
        newAdmin.email.trim().toLowerCase() &&
      countEmail >= 1
    ) {
      return res
        .status(400)
        .send({ message: `Email ${newAdmin.email} is already taken` });
    }

    updateFields.forEach(field => {
      if (newAdmin[field]) admin[field] = newAdmin[field];
    });
    admin.updatedAt = moment().unix();

    await admin.save();
    res.status(200).send({ data: admin });
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
 * Admin Login
 */
const loginAdmin = async (req, res) => {
  const { loginId, password } = req.body;
  try {
    const admin = await Admin.findByCredentials(loginId, password);
    const token = await admin.generateAuthToken();
    res.header("x-auth", token).send({
      data: {
        admin,
        token
      }
    });
  } catch (e) {
    // console.log(e.message);
    res.status(400).send({ message: e.message });
  }
};

/**
 * Admin logout
 */
const logoutAdmin = async (req, res) => {
  try {
    await req.admin.removeToken();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

/** Change password */
const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findByCredentials(email, oldPassword);
    admin.password = newPassword;
    admin.updatedAt = moment().unix();
    await admin.save();
    res.status(200).send({ data: admin });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

module.exports = {
  testAdmin,
  createAdmin,
  readAdmins,
  readOneAdmin,
  readCurrentAdmin,
  deleteAdmin,
  updateAdmin,
  loginAdmin,
  logoutAdmin,
  changePassword
};
