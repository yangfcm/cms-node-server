import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { DATABASE_CONNECTION_URI } from "./settings/constants";
import connectDatabase from "./settings/connectDatabase";
import authRouter from "./routers/auth";
import userRouter from "./routers/user";
import blogRouter from "./routers/blog";
import categoryRouter from "./routers/category";
import articleRouter from "./routers/article";
import getBlogByAddress from "./middleware/getBlogByAddress";

connectDatabase(DATABASE_CONNECTION_URI);

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/blogs/:address/categories", getBlogByAddress, categoryRouter);
app.use("/api/blogs/:address/articles", getBlogByAddress, articleRouter);

export default app;
