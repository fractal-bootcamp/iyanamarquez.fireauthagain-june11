import { NextFunction, Response, Request } from "express";
import auth from "./auth";
import bodyParser from "body-parser";
import cors from "cors";

const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

const users = [
  {
    id: 1,
    firebaseId: "eUQbA6wWHbe9t7V7b4SsEvnkstr2",
    name: "yayakix",
    email: "fakemail",
    privateMessage: "only yaya can see this",
  },
  {
    id: 2,
    firebaseId: "eUQbA5wWhbe9t7V7b4SsEvnkstr3",
    name: "A fake user",
    email: "fakeremail",
  },
];

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  console.log("hit here");
  const token = await req.headers.authorization?.split(" ")[1];
  const details = await auth.verifyIdToken(token!);
  const user = users.find((user) => user.firebaseId === details.uid);
  req["user"] = user;
  next();
};

app.get("/", requireAuth, (req: Request, res: Response) => {
  console.log("next next");
  console.log(req.user);
  res.send(JSON.stringify(req.user.privateMessage));
});

// app.get("/", requireAuth, (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
