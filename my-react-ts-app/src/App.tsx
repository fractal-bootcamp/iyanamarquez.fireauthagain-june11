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
  const [userPosts, setUserPosts] = useState([])
  const [displayName, setUserDisplayName] = useState([])


  const url = "http://localhost:3000"

  // const handleCreateUser = () => {
  //   console.log('create user')
  //   createUserWithEmailAndPassword(auth, "yayakixx@yahoo.com", 'password')
  //     .then((userCredential) => {
  //       // Signed up 
  //       const user = userCredential.user;
  //       console.log(user)
  //       // ...
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ..
  //     });
  // }
  // const handleSignIn = async () => {
  //   await signInWithEmailAndPassword(auth, "yayakix@yahoo.com", 'password')
  //     .then(async (userCredential) => {
  //       // Signed in 
  //       console.log('here')
  //       const user = userCredential.user;

  //     }).catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //     });
  // }

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
        // setSecretMessage(data)
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

  const createPostButton = async () => {
    console.log('clicked')
    const data = { title: "bkfebrebukvbuk", content: "this is some more fake content" }
    const token = await auth.currentUser?.getIdToken()
    console.log('clicked2')

    await fetch("http://localhost:3000/postapost", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body:
        JSON.stringify(data)
    })
      .then(res => res.json()).then((data) => {
        setUserPosts(data)
        console.log('data: ', data)
      })
  }

  const updateDisplayName = async () => {
    console.log('clicked')
    const data = { name: 'bruhname' }
    const token = await auth.currentUser?.getIdToken()
    console.log('clicked2')

    await fetch("http://localhost:3000/changeName", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body:
        JSON.stringify(data)
    })
      .then(res => res.json()).then((data) => {

        console.log('data: ', data)
      })
  }

  return (
    <>
      <h1> {firebaseUser ? <>Hello, {firebaseUser.email}</> : "please sign in/up"}</h1>
      {/* <h1>
        {getAuth().currentUser?.email}
      </h1> */}
      {/* {secretMessage && secretMessage} */}
      <br />
      <h1>{firebaseUser ? <button onClick={signOutUser}>sign out</button> : null}</h1>

      <br />
      <br />
      {/* <button onClick={() => {
        sendAuthRequest(url)
      }}>request secret message</button> */}
      <hr />
      <SignInSection />
      {firebaseUser ? null : <SignUpSection />}
      <br />
      <br />
      <button onClick={updateDisplayName}>change your name</button>

      <button onClick={createPostButton}>Post a new post</button>
      {userPosts.map((x) => {
        return <li><h2>post title</h2>
          {x.title}
          <p>post content: </p>
          {x.content}
        </li>
      })}


    </>
  )
}

export default App
