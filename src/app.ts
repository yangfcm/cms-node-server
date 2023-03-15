import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
import { DATABASE_CONNECTION_URI } from "./settings/constants";
import connectDatabase from "./settings/connectDatabase";
import authRouter from "./routers/auth";
import userRouter from "./routers/user";
import blogRouter from "./routers/blog";
import categoryRouter from "./routers/category";
import getBlogByAddress from "./middleware/getBlogByAddress";

connectDatabase(DATABASE_CONNECTION_URI);

const app = express();

app.use(bodyParser.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/blogs/:address/categories", getBlogByAddress, categoryRouter);

export default app;
