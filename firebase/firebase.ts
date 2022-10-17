// Importing the vital components to initialize firebase
import { initializeApp } from 'firebase/app';
import {getStorage} from 'firebase/storage';
import {getAuth} from 'firebase/auth';

// Firebase supplied info
const firebaseConfig = {
    apiKey: "AIzaSyCRCPr_pjfXU43gX5lYSLGzcMeoKbJMMOk",
    authDomain: "resource-management-ec21a.firebaseapp.com",
    projectId: "resource-management-ec21a",
    storageBucket: "resource-management-ec21a.appspot.com",
    messagingSenderId: "1025419741589",
    appId: "1:1025419741589:web:4a735ab025a22dc47b0e9c",
}

// Creating a universal firebase variable to be used later
const firebase = initializeApp(firebaseConfig);
// Creating a universal storage bucket variable to be used later
export const storage = getStorage(firebase)
// Creating a universal auth variable to be used later
export const auth : any = getAuth(firebase);
export default firebase;