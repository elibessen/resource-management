import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCRCPr_pjfXU43gX5lYSLGzcMeoKbJMMOk",
    authDomain: "resource-management-ec21a.firebaseapp.com",
    projectId: "resource-management-ec21a",
    storageBucket: "resource-management-ec21a.appspot.com",
    messagingSenderId: "1025419741589",
    appId: "1:1025419741589:web:4a735ab025a22dc47b0e9c"
}

const firebase = initializeApp(firebaseConfig);

export default firebase;