import "dotenv/config";
import express from "express";
import checkDBConnection from "./db/helpers/checkDBConnection.js";
import convertSnakeToCamelResponse from "./middlewares/convertSnakeToCamelResponse.js";

checkDBConnection();

const app = express();
const port = 3000;

app.use(express.json());
app.use(convertSnakeToCamelResponse());
app.listen(port);

app.get("/", async (req, res) => {
  return res.send("Hello World!");
});
