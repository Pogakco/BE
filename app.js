import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import checkDBConnection from "./db/helpers/checkDBConnection.js";
import convertSnakeToCamelResponse from "./middlewares/convertSnakeToCamelResponse.js";
import userRouter from "./routers/userRouter.js";

checkDBConnection();

const app = express();
const port = 3000;

app.use(express.json());
app.use(convertSnakeToCamelResponse());
app.use(cookieParser());
app.listen(port);

app.use("/api", userRouter);

