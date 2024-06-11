import { NextFunction, Response, Request } from "express";
import auth from "./auth";
import bodyParser from "body-parser";
import cors from "cors";
import { createNewUser } from "./db";

const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  console.log("hit here");
  const token = await req.headers.authorization?.split(" ")[1];
  const details = await auth.verifyIdToken(token!);

  // const user = users.find((user) => user.firebaseId === details.uid);
  req["user"] = details;
  next();
};

app.get("/", requireAuth, (req: Request, res: Response) => {
  res.send(JSON.stringify(req.user.privateMessage));
});

app.post("/newuser", requireAuth, async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const firebaseId = req.user.uid;
  const userToMake = {
    email: userEmail,
    password: userPassword,
    firebaseId: firebaseId,
  };

  await createNewUser(userToMake);

  console.log("body data: ", req.body);
  console.log("reqbodyuser: ", req.user);
  // create user if req success
  // prismacreate with req.body.email/ password req.use.uid is firebase id

  res.send("user created");
});
// app.get("/", requireAuth, (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
