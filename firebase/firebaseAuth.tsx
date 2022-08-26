import { useState, useEffect } from 'react';
import firebase, {auth} from './firebase';
import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';

const firestore = getFirestore(firebase);

const formatAuthUser : any = (user:any) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged= async(authState:any) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return;
    }

    setLoading(true)
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);    
    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signInWithEmailAndPassword = (email:any, password:any) => {
    auth.signInWithEmailAndPassword(email, password);
  }

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

  return {
    authUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
  };
}