import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';
import firebase from '../firebase/firebase';

// Creates a reference to the database
const firestore = getFirestore(firebase);

// Exporting this function so it can be reused later
export const updateMailData = async () => {
    // Creating a reference to the specific doc in the database that I want to access
    const reference = doc(firestore, "mail", "mailData");
    // Creating a snapshot of the data
    const snapshot = await getDoc(reference);
    // Creating a local object and pushing the snapshot data into it
    var object:any = snapshot.data()

    // Looping through the objects array length and pushing 
    // that data into the local mail object ready for exporting
    for(var i=0; i < object.data.length; i++){
        mail.push(object.data[i]);
    }
    console.log(mail)
}

// Running the function
updateMailData();

// Local array for exporting
const mail:any=[

]

export default mail