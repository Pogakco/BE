import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import checkDBConnection from "./db/helpers/checkDBConnection.js";
import convertSnakeToCamelResponse from "./middlewares/convertSnakeToCamelResponse.js";
import userRouter from "./routers/userRouter.js";
import roomRouter from "./routers/roomRouter.js";

checkDBConnection();

const port = 3000;

const app = express();

app.use(express.json());
app.use(convertSnakeToCamelResponse());
app.use(cookieParser());

app.use("/api", userRouter);
app.use("/rooms", roomRouter);

app.listen(port);
