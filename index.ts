import { NextFunction, Response, Request } from "express";
import auth from "./auth";
import bodyParser from "body-parser";
import cors from "cors";
import {
  createNewPostOnUser,
  createNewUser,
  findExistingUser,
  findExistingUserWithEmailOnly,
  getUsersPosts,
  updateUserDisplayName,
} from "./db";
import { DecodedIdToken } from "firebase-admin/auth";

const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  console.log("hit here");
  const token = await req.headers.authorization?.split(" ")[1];
  const details = await auth.verifyIdToken(token!);

  // const user = users.find((user) => user.firebaseId === details.uid);
  req["user"] = details;
  next();
};

app.get("/", requireAuth, (req: Request, res: Response) => {
  res.send(JSON.stringify(req.user?.privateMessage));
});

app.post("/newuser", requireAuth, async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const firebaseId = req.user?.uid;
  const userToMake = {
    email: userEmail,
    password: userPassword,
    firebaseId: firebaseId,
  };

  await createNewUser(userToMake);

  res.send("user created");
});

app.post("/signinuser", requireAuth, async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userToFind = {
    email: userEmail,
    password: userPassword,
  };

  // const foundUser = await findExistingUser(userToFind);
  // look at details of found user

  res.send("user found");
});

// let an auth user make a post?
app.post("/postapost", requireAuth, async (req: Request, res: Response) => {
  const userEmail = req.user?.email;
  const userToFind = {
    email: userEmail,
  };
  const postData = await req.body;
  const foundUser = await findExistingUserWithEmailOnly(userToFind.email);
  await createNewPostOnUser(foundUser.id, postData);

  // get a users posts and send them back
  const usersPosts = await getUsersPosts(foundUser.id);
  console.log(usersPosts);

  res.json(usersPosts);
  // use user email/id? to post a post
});

// let an auth user change their name?
app.post("/changeName", requireAuth, async (req: Request, res: Response) => {
  const userEmail = req.user?.email || "errormail";

  const nameData = await req.body.name;
  console.log(userEmail, nameData);
  await updateUserDisplayName(userEmail, nameData);
  const foundUser = await findExistingUserWithEmailOnly(userEmail);

  res.json(foundUser);
  // use user email/id? to post a post
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
