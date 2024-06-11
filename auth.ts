import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

import serviceAccountKey from "./serviceAccountKey.json";

const app = admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: serviceAccountKey.private_key,
    projectId: serviceAccountKey.project_id,
    clientEmail: serviceAccountKey.client_email,
  }),
});

const auth = getAuth(app);

export default auth;
