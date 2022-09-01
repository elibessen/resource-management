// Importing important modules from the firebase node modules and firebase.ts
import firebase from './firebase';
import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';

// Getting the firebase config
const firestore = getFirestore(firebase);

// Grabs collections and all docs from the database whenever it is called
export const getCollection = async <T>(collectionName: string) => {
    const docs = await getDocs(query(collection(firestore, collectionName)));

    docs.forEach(
        doc => {
            const id = doc.id;
            const data = doc.data();
            console.log(id, data)
        }
    )
}

// Creates document in database whenever it is called.
export const addDocument = async<T>(collectionName: string, data: T, documentName: string) => {
    console.log("Created Document");
    return await setDoc(doc(firestore, collectionName, documentName), {
        'data': data
    })
}

export const createCollection = async(collectionName: string) => {
    console.log("Created Collection");
    return await collection(firestore, collectionName);
}