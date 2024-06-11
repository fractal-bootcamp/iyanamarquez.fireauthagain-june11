import { useState } from 'react'

import './App.css'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseconfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


function App() {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [secretMessage, setSecretMessage] = useState('null')

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
    const response = await fetch(url, {
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
      // setFirebaseUser(user)
      const uid = user.uid;
      setFirebaseUser(user)
      console.log('there is someone logged in', user)
      // ...
    } else {
      // User is signed out
      // ...
      console.log('there is nobody logged in')

    }

  });


  return (
    <>
      {/* <h1>{firebaseUser ? firebaseUser.email : "nobody here"}</h1> */}
      <h1>
        {getAuth().currentUser?.email}
      </h1>
      <p>{secretMessage}</p>
      <div>
        <form action="/login" method="POST">
          <label for="name">Name</label>
          <input type="text" name="name" placeholder="Password" />
          <br />
          <br />

          <label for="password">Password</label>
          <input type="text" name="password" placeholder="Password" />
          <br />
          <br />

          <button type="submit">Login</button>

        </form>
      </div>
      <br />

      <button onClick={handleSignIn}>sign in</button>
      <br />
      <br />

      <button onClick={signOutUser}>sign out</button>
      <br />
      <br />
      <button onClick={() => {
        sendAuthRequest(url)
      }}>send request</button>

    </>
  )
}

export default App
