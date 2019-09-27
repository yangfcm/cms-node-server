const mongoose = require("mongoose");
const User = require("./user");

const AdminSchema = new mongoose.Schema({
  status: {
    type: Number,
    required: true,
    default: 0 // For admin, set inactive by default
  },
  role: {
    type: Number,
    required: [true, "Admin's role must be specified"],
    enum: [1, 2] // Admin has two role levels: 1 - super admin, 2 - ordinary admin
    // ordinary admin cannot create, delete, update other admins, super admin can.
    // Admins cannot delete account of themsevles.
    // 当然，这样的权限控制是非常粗糙的，还有很大的改进空间。但对目前这个作为个人博客来说，是足够了。
  }
});

const Admin = User.discriminator("Admin", AdminSchema);

module.exports = Admin;
