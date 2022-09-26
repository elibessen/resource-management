// Importing my own files
import styles from '../styles/Dashboard.module.css';
import firebase from '../firebase/firebase';

// Data being imported
import emailData from '../data/mail'
import projects from '../data/projects'

// Importing modules to be used in the dashboard
import React, { useState } from 'react';
import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase/firebase';
import { ref, getDownloadURL, uploadBytesResumable, listAll } from "firebase/storage"

// Importing custom modules
import {getCollection} from '../firebase/db'


const Dashboard = () => {
  // Getting the firebase config
  const firestore = getFirestore(firebase);

  const {user} = useAuth();

  // Dynamically show and hide components
  const [isShown, setIsShown] = useState(false);
  const handleClick = (event:any)  => {
    setIsShown((current:any) => !current);
  }

  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);

  const bucketRef = ref(storage, 'files/');
  listAll(bucketRef).then((res) => {
    res.prefixes.forEach((folderRef) => {
      
    })
    res.items.forEach((itemRef) => {

    })
  }).catch((error) => {
    console.log(error)
  })

  // When the user submits a file through the form
  const handleSubmit = (e:any) => {
      e.preventDefault()
      // Get file name and extension
      const file = e.target[0]?.files[0];
      console.log(file);

      // If no file has been uploaded, then exit the function
      if (!file) return;

      // Creating a reference for the storage bucket in firebase
      const storageRef = ref(storage, `files/${file.name}`);
      
      // Upload file to the storage bucket with the file =
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgresspercent(progress);
          alert("Uploaded Successfully");
          setDoc(doc(firestore, 'files', file.name), {
            dateAdded: Date()
          })
          console.log(getCollection('files'))
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL:any) => {
            setImgUrl(downloadURL);
          });
        }
      );
    };

    console.log(getCollection('files'))

  return (
    <div>
      <select>
        {/* {projects.map((e:any, index:any) => {
          // console.log(e.project1.projectName)
          console.log(e);
          for(var i = 1; i < e.projectAmount; i++){
            console.log(e.project1);
            // <option key={`${e}`}>{e}</option>
           }
        })} */}
      </select>
      {/* <ul>
        <li><a onClick={handleClick}>Send email</a></li>
      </ul>
      {isShown && (
        <SendMail></SendMail>
      )} */}
      <div id="content" className={styles.contentContainer}>

        <div id="mail" className={styles.mailContainer}>
          <div style={{borderBlockEnd:'1px solid black'}}>
            <h1>Mail</h1>
          </div>
          
          <div style={{width: '100vw'}}>
            {emailData.map((e:any, index:any) => {
              if(e.to === `${user.email}` || e.sender === `${user.email}`){
                return(
                  <p key={`${e.sender}_{e.content}`} className={styles.innerMailContainer}>
                    <div className={styles.informationMailContainer}>
                      {/* <h4>{acryonm}</h4> */}
                      <div>
                        <h5>
                          From: {e.sender}
                        </h5>
                        <h5>
                          To: {e.to}
                        </h5>
                      </div>
                    </div>
                    <p id="emailContent">
                      {e.content}
                    </p>
                    <p>
                    </p>
                  </p>
                )
              }
            })}
          </div>
        </div>

        <div id="files" className={styles.fileContainer}>
          <div style={{borderBlockEnd:'1px solid black'}}>
            <h1>Files</h1>
            <form onSubmit={handleSubmit}>
              <input type='file' />
              <button type='submit'>Upload</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard