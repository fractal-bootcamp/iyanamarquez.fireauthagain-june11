import { useState } from 'react'

import './App.css'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseconfig';
import SignInSection from './SignIn';
import SignUpSection from './Signup';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


function App() {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [secretMessage, setSecretMessage] = useState(null)

  const url = "http://localhost:3000"

  const handleCreateUser = () => {
    console.log('create user')
    createUserWithEmailAndPassword(auth, "yayakixx@yahoo.com", 'password')
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }
  const handleSignIn = async () => {
    await signInWithEmailAndPassword(auth, "yayakix@yahoo.com", 'password')
      .then(async (userCredential) => {
        // Signed in 
        console.log('here')
        const user = userCredential.user;

      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  const sendAuthRequest = async (url: string) => {
    const token = await auth.currentUser?.getIdToken()
    await fetch(url, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json()).then((data) => {
        setSecretMessage(data)
        console.log(data)
      })
    // ...
  }

  // const handleRequest = async () => {
  //   const response = await fetch("http://localhost:3005.com/", {
  //     method: "POST", // or 'PUT'
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(token),
  //   });
  // }

  // Sign out functionality
  const signOutUser = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setFirebaseUser(user)
      // ...
    } else {
      setFirebaseUser(null)
      // User is signed out
    }

  });

  return (
    <>
      {/* <h1>{firebaseUser ? firebaseUser.email : "nobody here"}</h1> */}
      <h1>
        {getAuth().currentUser?.email}
      </h1>
      {secretMessage && secretMessage}
      <br />
      <button onClick={signOutUser}>sign out</button>
      <br />
      <br />
      <button onClick={() => {
        sendAuthRequest(url)
      }}>request secret message</button>
      <hr />
      <SignInSection />

      <SignUpSection />


    </>
  )
}

export default App
