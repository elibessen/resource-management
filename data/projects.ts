import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';
import firebase from '../firebase/firebase';

const firestore = getFirestore(firebase)

export const updateProjectData = async () => {
    const reference = doc(firestore, "projects", "projectsData");
    // Creating a snapshot of the data
    const snapshot = await getDoc(reference);
    // Creating a local object and pushing the snapshot data into it
    var object:any = snapshot.data()

    // Looping through the objects array length and pushing 
    // that data into the local project object ready for exporting
    for(var i=0; i < object.data.length; i++){
        projects.push(object.data[i]);
    }
    console.log(projects)
}

// Running the function
updateProjectData();

// Local array for exporting
const projects:any = [
    
]

export default projects