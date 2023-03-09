import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import connectDatabase from "./settings/connectDatabase";
import authRouter from "./routers/auth";
import userRouter from "./routers/user";

dotenv.config();
const DATABASE_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI || "";
connectDatabase(DATABASE_CONNECTION_URI);

const app = express();

app.use(bodyParser.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default app;
