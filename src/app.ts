import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./settings/connectDatabase";

dotenv.config();
const DATABASE_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI || "";
connectDatabase(DATABASE_CONNECTION_URI);

const app = express();

export default app;
