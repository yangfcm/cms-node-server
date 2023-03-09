import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {}

const userSchema = new mongoose.Schema<IUser>({});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
