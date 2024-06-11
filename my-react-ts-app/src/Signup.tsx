import { useEffect, useState } from 'react'

import './App.css'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseconfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


function SignUpSection() {
    const [showSignUp, setShowSignUp] = useState(true)

    // useEffect(() => {
    //     auth.currentUser
    // }, [])

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            setShowSignUp(false)
        } else {
            () => {
                setShowSignUp(true)
                console.log('create user')
            }
        }
    });
    const data = {
        email: 'yippie@yahoo.com',
        password: 'password'

    }

    const handleSignUp = async () => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (userCredential) => {
                // Signed up 
                const user = userCredential.user;
                // send post req to create new user on db
                const token = await auth.currentUser?.getIdToken()
                await fetch("http://localhost:3000/newuser", {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body:
                        JSON.stringify(data)
                })
                    .then(res => res.json()).then((data) => {
                        console.log(data)
                    })
                // ...

            })
            .catch((error) => {
                // const errorCode = error.code;
                // const errorMessage = error.message;
                console.log(error)
                // ..
            });
    }

    return (
        <>
            Hello there.
            {showSignUp && <div>
                <h2>Signup form</h2>
                <form action="/login" method="POST">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" value={data.email} placeholder="Password" />
                    <br />
                    <br />

                    <label htmlFor="password">Password</label>
                    <input type="text" name="password" value="password" placeholder="Password" />
                    <br />
                    <br />
                </form>
                <button onClick={handleSignUp}>SIGNUP</button>
            </div>}
        </>
    )
}

export default SignUpSection
