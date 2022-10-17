import { useState, useEffect } from 'react';
import firebase, {auth} from './firebase';
import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';

const firestore = getFirestore(firebase);

// Creating a format for the user information and making the type any
const formatAuthUser : any = (user:any) => ({
  displayName: user.displayName,
  uid: user.uid,
  email: user.email
});

export default function useFirebaseAuth() {
  // Creating variables and listenting to the state
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Checking if the users authentication state changed and if it doesn't
  // Set the AuthUSer to null and the User Loading to false
  const authStateChanged= async(authState:any) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return;
    }
    // However if the auth state doesn't change then run the following
    setLoading(true)
    // Formatting the user 
    var formattedUser = formatAuthUser(authState);
    // Passing the formatted user info to the setAuthUser
    setAuthUser(formattedUser);    
    setLoading(false);
  };

  const clear = () => {
    // Clearing the auth state etc
    setAuthUser(null);
    setLoading(true);
  };

  // Sign in the user with the user information and tell the auth to sign in
  const signInWithEmailAndPassword = (email:any, password:any) => {
    auth.signInWithEmailAndPassword(email, password);
    console.log(auth);
  }

  // Creating a user with the supplied info and telling the auth to create an account
  const createUserWithEmailAndPassword = (email:any, password:any) => {
    auth.createUserWithEmailAndPassword(email, password);
  
  }

  const signOut = () => {
    auth.signOut().then(clear);
  }

// listen for Firebase state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  // Returning all of the auth information to be used later
  return {
    authUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
  };
}