import firebase from './firebase';
import {addDoc, collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';

const firestore = getFirestore(firebase);

// Grabs collections from the database whenever it is called
export const getCollection = async <T>(collectionName: string, lastElement: any,) => {
    let dates: any[] = [];
    const lastDocSnap = await getDoc((doc(firestore, lastElement)));
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
export const addDocument = async<T>(collectionName: string, data: T) => {
    return await addDoc(collection(firestore, collectionName), data);
}
