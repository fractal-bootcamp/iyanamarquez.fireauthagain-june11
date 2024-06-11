import { useState } from 'react'

import './App.css'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseconfig';
import SignInSection from './SignIn';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


function AuthorizedView(props) {

    return (
        <>
            <h1>Only VIP members can see this</h1>

        </>
    )
}

export default AuthorizedView
