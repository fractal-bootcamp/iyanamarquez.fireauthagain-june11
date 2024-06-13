import { useEffect, useState } from 'react'

import './App.css'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
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
  const [newNameInput, setNewNameInput] = useState('')
  const [nameInput, setNameInput] = useState('')

  const handleInputChange = (e) => {
    // setNewNameInput('hi')
    console.log(e.target.value)
    setNewNameInput(e.target.value)
  }

  const url = "http://localhost:3000"

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


  // Sign out functionality
  const signOutUser = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user)
        // ...
      } else {
        setFirebaseUser(null)
        // User is signed out
      }
    });
  }, [])

  const createPostButton = async () => {
    const data = { title: "vtjhvjyv", content: "this is some more fake content" }
    const token = await auth.currentUser?.getIdToken()

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
    const data = { name: nameInput }
    const token = await auth.currentUser?.getIdToken()
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
        setUserDisplayName(data.name)
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
      {displayName}
      <br />
      <input value={nameInput} onChange={e => {
        setNameInput(e.target.value)
      }} />
      <input value={newNameInput} onChange={e => console.log('wtf')} />
      <button onClick={updateDisplayName}>change your name</button>

      <button onClick={createPostButton}>Post a new post</button>
      {
        userPosts.map((x) => {
          return <li><h2>post title</h2>
            {x.title}
            <p>post content: </p>
            {x.content}
          </li>
        })
      }


    </>
  )
}

export default App
