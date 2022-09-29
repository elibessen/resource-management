// Importing my own files
import styles from '../styles/Dashboard.module.css';
import firebase from '../firebase/firebase';

// Data being imported
import emailData from '../data/mail'
import fileData from '../data/files'
import projects from '../data/projects'

// Importing modules to be used in the dashboard
import React, { useState } from 'react';
import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase/firebase';
import { ref, getDownloadURL, uploadBytesResumable, listAll, getStorage } from "firebase/storage"
import {Button, Table, Form} from 'react-bootstrap'

// Importing custom components
import SendMail from '../components/SendMail';

const Dashboard = () => {
  // Getting the firebase config
  const firestore = getFirestore(firebase);

  // Getting the user information from the auth
  const {user} = useAuth();
  

  // Setting states to the arrays so the mapping can reupdate
  const [emailState, setEmailState] = useState(emailData);
  const [filesState, setFilesState] = useState(fileData)

  // Dynamically show and hide components
  const [isShown, setIsShown] = useState(false);
  // Checks if the element is shown or hidden
  const handleClick = (event:any)  => {
    setIsShown((current:any) => !current);
  }

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
      
      // Upload file to the storage bucket with the file
      const uploadTask = uploadBytesResumable(storageRef, file);

      console.log("Uploaded file: " + file)

      // When the storage bucket state has changed run the following functions
      uploadTask.on("state_changed",
        (snapshot) => {
          setDoc(doc(firestore, 'files', file.name), {
            fileName: file.name,
            dateAdded: Date()
          })
        },
        (error) => {
          alert(error);
        }
      );
    };

    // Function that downloads specific files from the storage bucket
    const handleDownload = (fileName: string) => {
      // Create reference to the storage bucket
      const storage = getStorage();
      // Get the download url from the bucket
      getDownloadURL(ref(storage, `files/${fileName}`)).then((url:any) => {
        // Create a request to the server to download the file and its content
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
      })
    }

    // handleDownload("272177W-2PYI20-AT1-DesignAndDeconstructMrSmith.docx")


  return (
    <div>
      <div id="content" className={styles.contentContainer}>

        <div>
            <ul>
              <Button variant="primary" onClick={handleClick}>Store Mail</Button>
            </ul>
              {isShown && (
                <SendMail></SendMail>
              )}
          </div>

        <div id="mail" className={styles.mailContainer}>
          <Table>
            <thead>
              <tr>
                <th>Mail</th>
              </tr>
            </thead>
            <tbody>
              {emailData.map((e:any, index:any) => {
                // If the email is from or to the users current email when logged in and displays it accordingly
                if(e.to === `${user.email}` || e.sender === `${user.email}`){
                  return(
                    // Returning the component to be rendered by next.js
                    <div>
                      <tr key={`${e.sender}_{e.content}`} className={styles.innerMailContainer}>
                        <th>
                          From: {e.sender}
                        </th>
                        <th>
                          To: {e.to}
                        </th>
                        <th>
                          Subject: {e.subject}
                        </th>
                        <p id="emailContent">
                          {e.content}
                        </p>
                      </tr>
                    </div>
                  )
                }
              })}
            </tbody>
          </Table>
          <div style={{width: '100vw'}}>
            {/* Mapping all the email data into independent components to be rendered by next.js */}
            
          </div>
        </div>

        <div id="files" className={styles.fileContainer}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Files</th>
                <th>
                  <Form onSubmit={handleSubmit} className={styles.fileImportForm}>
                    <Form.Control type='file' className={styles.fileImport}/>
                    <Button variant="primary" type='submit'>Upload</Button>
                  </Form>
                </th>
              </tr>
            </thead>
          </Table>
          <div> 
          {fileData.map((e:any, index:any) => {
                return(
                  // Returning the component to be rendered by next.js
                  <p key={`${e.dateAdded}_{e.fileName}`}>
                    <div>
                      <div>
                        <a>{e.fileName}</a>
                      </div>
                    </div>
                  </p>
                )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard