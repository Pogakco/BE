import "dotenv/config";
import express from "express";
import checkDBConnection from "./db/helpers/checkDBConnection.js";

checkDBConnection();

const app = express();
const port = 3000;

app.listen(port);

app.get("/", async (req, res) => {
  return res.send("Hello World!");
});
