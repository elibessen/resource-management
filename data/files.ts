import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable, listAll, getStorage } from "firebase/storage"
import firebase from '../firebase/firebase';
import { storage } from '../firebase/firebase';

// Creates a reference to the database
const firestore = getFirestore(firebase);

// Getting files from the database
export const getFileReference = async () => {
    var currentFile;
    files = []
    // Awaiting for firebase to return a value for all the documents in the files collection
    const docs = await getDocs(query(collection(firestore, 'files')));

    // Looping through each document from the collection and pushing the file data into an array;
    docs.forEach(
      doc => {
        currentFile = doc.data();
        files.push(currentFile)
        console.log(files);
      }
    )
  }

getFileReference();

var files:any = [

];

export default files
