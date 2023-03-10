import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
import connectDatabase from "./settings/connectDatabase";
import authRouter from "./routers/auth";
import userRouter from "./routers/user";
import { DATABASE_CONNECTION_URI } from "./settings/constants";

connectDatabase(DATABASE_CONNECTION_URI);

const app = express();

app.use(bodyParser.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default app;
