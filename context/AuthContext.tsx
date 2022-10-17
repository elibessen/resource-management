import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase/firebase';
import firebase from '../firebase/firebase';
import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';

// A context is a method to pass props from parent to child components
// by storing the props and using these props from the store by child
// components without actually passing them manually at each level of the
// component tree

// Creating an context for the authentication component and refering to firebase
const AuthContext = createContext<any>({});
const firestore = getFirestore(firebase);

// Exporting the auth context to be used in other files
export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // Creating variables and listening to the state
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // The effect hook lets me peform side effects in function components
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If the user doesn't exist write the information to the database
      if (user) {
        setDoc(doc(firestore, 'Users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Using firebase signup functions
  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }
  // Using firebase login functions
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    setUser(null)
    await signOut(auth)
  }

  return (
    // Returning the AuthContext as a component
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}