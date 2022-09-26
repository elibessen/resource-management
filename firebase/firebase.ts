import { initializeApp } from 'firebase/app';
import {getStorage} from 'firebase/storage';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCRCPr_pjfXU43gX5lYSLGzcMeoKbJMMOk",
    authDomain: "resource-management-ec21a.firebaseapp.com",
    projectId: "resource-management-ec21a",
    storageBucket: "resource-management-ec21a.appspot.com",
    messagingSenderId: "1025419741589",
    appId: "1:1025419741589:web:4a735ab025a22dc47b0e9c",
}

const firebase = initializeApp(firebaseConfig);
export const storage = getStorage(firebase)

export const auth : any = getAuth(firebase);
export default firebase;