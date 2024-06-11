import { NextFunction, Response, Request } from "express";
import auth from "./auth";
import bodyParser from "body-parser";

const express = require("express");
var cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = await req.headers.authorization?.split(" "[1]);
  console.log("token: ", token);

  next();
};

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// app.get("/", requireAuth, (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
