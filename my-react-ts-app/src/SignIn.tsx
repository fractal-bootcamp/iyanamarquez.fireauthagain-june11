import { useState } from 'react'

import './App.css'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseconfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


function SignInSection() {
    const [firebaseUser, setFirebaseUser] = useState(null)

    const url = "http://localhost:3000"

    const handleSignIn = async () => {

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // setFirebaseUser(user)
                const uid = user.uid;
                setFirebaseUser(user)
                console.log('there is someone logged in', user)
                // ...
            } else {
                await signInWithEmailAndPassword(auth, "yayakix@yahoo.com", 'password')
                    .then(async (userCredential) => {
                        // Signed in 
                        console.log('here')
                        const user = userCredential.user;

                    }).catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                    });
                // User is signed out
                // ...
                console.log('there is nobody logged in')
            }
        });
    }

    return (
        <>
            {!auth.currentUser && <>            <div>
                <form action="/login" method="POST">
                    <label for="name">Name</label>
                    <input type="text" name="name" value="defaultemail" placeholder="Password" />
                    <br />
                    <br />

                    <label for="password">Password</label>
                    <input type="text" name="password" value="defaultpassword" placeholder="Password" />
                    <br />
                    <br />

                </form>
                <button onClick={handleSignIn}>sign in</button>
            </div>
            </>}
        </>
    )
}

export default SignInSection
