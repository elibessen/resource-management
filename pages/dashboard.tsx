// Importing my own files
import styles from '../styles/Dashboard.module.css';
import firebase from '../firebase/firebase';

// Data being imported
import emailData from '../data/mail'
import fileData from '../data/files'
import projectData from '../data/projects'

// Importing modules to be used in the dashboard
import React, { useState, useRef } from 'react';
import {deleteDoc, addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase/firebase';
import {ref, getDownloadURL, uploadBytesResumable, listAll, getStorage, deleteObject } from "firebase/storage"
import {Button, Table, Form, Dropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'next/image';
import Modal from 'react-bootstrap/Modal';

// Importing functions
import updateMailData from "../data/mail";

const Dashboard = () => {
  // Getting the firebase config
  const firestore = getFirestore(firebase);

  // Getting the user information from the auth
  const {user} = useAuth();
  
  // Setting states to the arrays so the mapping can reupdate
  const [emailState, setEmailState] = useState(emailData);
  const [filesState, setFilesState] = useState(fileData);

  // Getting the current project selected in the dropdown
  const [value, setValue] = useState('Test Project 1')

  // Listens to inputs from the form
  const emailInputReference:any = useRef(null);
  const subjectInputReference:any = useRef(null);
  const contentInputReference:any = useRef(null);

  // Listens to inputs from the form
  const projectNameReference:any = useRef(null);
  const managerNameReference:any = useRef(null);
  const locationReference:any = useRef(null);
  const completiondateReference:any = useRef(null);
  const clientReference:any = useRef(null)

  // Store email modal
  const [emailModal, setEmailModal] = useState(false);
  const handleEmailClose = () => setEmailModal(false);
  const handleEmailShow = () => setEmailModal(true);

  // Create project modal
  const [projectModal, setProjectModal] = useState(false);
  const handleProjectClose = () => setProjectModal(false);
  const handleProjectShow = () => setProjectModal(true);

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
            dateAdded: Date(),
            project: value
          })
        },
        (error) => {
          alert(error);
        }
      );
    };

    // When the user submits new mail to be stored a new local object is created and is pushed into the mail data array
    const submitMail = async () => {
      // Creating an object with all of the data supplied by the user
        var object = {
            project: value,
            mailID: "Test",
            sender: user.email,
            subject: subjectInputReference.current.value,
            to: emailInputReference.current.value,
            content: contentInputReference.current.value
        }
        emailData.push(object);
        setEmailModal(false);
        // Once all the local data storage is completed the data will then be stored in firebase
        return await setDoc(doc(firestore, 'mail', 'mailData'), {
            'data': emailData
        })
    }

    // When the user submits a new project fun the following function
    const submitProject = async () => {
      // Creating an object with all of the data supplied by the user
      var object = {
        dueDate: completiondateReference.current.value,
        projectClient: clientReference.current.value,
        projectID: "Test",
        projectLocation: locationReference.current.value,
        projectManager: managerNameReference.current.value,
        projectName: projectNameReference.current.value
      }
      projectData.push(object)
      setProjectModal(false)
      // Once all the local data is stored then it will be stored within the database
      return await setDoc(doc(firestore, 'projects', 'projectsData'), {
        'data': projectData
      })
    }

  return (
    <Container fluid>
      <div>
        {/* A modal/popup for submition form */}
        <Modal show={emailModal} onHide={handleEmailClose} className={styles.flexColumn}>
          <Modal.Header closeButton>
            <Modal.Title>Store mail</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
                <Form.Label>To:</Form.Label> 
                <Form.Control type="text" name="email address" ref={emailInputReference}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Subject:</Form.Label> 
                <Form.Control type="text" name="Subject" ref={subjectInputReference}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Content:</Form.Label> 
                <Form.Control type="text" name="Content" ref={contentInputReference}></Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={submitMail}>Store</Button>
            </Form>
            <Button variant="secondary" onClick={handleEmailClose}>Cancel</Button>
          </Modal.Body>
        </Modal>

        <Modal show={projectModal} onHide={handleProjectClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
                <Form.Label>Project Name:</Form.Label> 
                <Form.Control type="text" name="email address" ref={projectNameReference}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Project Manager:</Form.Label> 
                <Form.Control type="text" name="Subject" ref={managerNameReference}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Client:</Form.Label> 
                <Form.Control type="text" name="Content" ref={clientReference}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Project Location:</Form.Label> 
                <Form.Control type="text" name="Content" ref={locationReference}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Project Completion Date:</Form.Label> 
                <Form.Control type="text" name="Content" ref={completiondateReference}></Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={submitProject}>Store</Button>
            </Form>
            <Button variant="secondary" onClick={handleProjectClose}>Cancel</Button>
          </Modal.Body>
        </Modal>

        <div id="content" className={styles.contentContainer}>
          <Container fluid>
            <Row>
              <Col md="auto">
                <select value={value} onChange={(e) => {
                    setValue(e.target.value);
                  }}>
                    <option selected disabled>Select Project</option>
                    {projectData.map((e:any, index:any) => {
                      return( 
                        <option value={e.projectName}>{e.projectName}</option>  
                      ) 
                    })}
                  </select>
              </Col>
              <Col md="auto">
                <Button variant="outline-primary" onClick={handleProjectShow}>Create Project</Button>
              </Col>
              <Col md="auto">
                <Button variant="outline-primary" onClick={handleEmailShow}>Store Mail</Button>
              </Col>
              <Col>
                <Button variant="outline-danger" onClick={() => {
                  // Loop through all of the projects
                  for(var i=0; i<projectData.length; i++){
                    // Check if any projects match the current selected project
                    if(projectData[i].projectName === value){
                      console.log("Found it", projectData[i]);
                      // If the current status of the project is not closed then make it closed
                      if(projectData[i].projectStatus != 'Closed'){
                        projectData[i].projectStatus = 'Closed';
                        console.log(projectData);
                      } else{
                        // Tells the user that the project is already closed
                        alert("Project is already closed!")
                      }
                      // Break the for loop for efficiency
                      break;
                    }
                  }
                  const updateProjects = async () => {
                    return await setDoc(doc(firestore, 'projects', 'projectsData'), {
                      'data': projectData
                    })
                  }
                  updateProjects()
                }}>Close Project</Button>
              </Col>
            </Row>
          </Container>
          <div>
            <Container fluid> 
              <div className={styles.detailsContainer}>
                <h4>Project Details</h4>
                {projectData.map((e:any, index:any) => {
                  if(e.projectStatus === 'Open'){

                  }
                  if(e.projectName === value){
                    return(
                      <Container fluid>
                        <Row>
                          <Col md="auto">
                            <p>{e.projectStatus}</p>
                          </Col>
                          <Col md="auto">
                            <p>Project Manager: {e.projectManager}</p>
                            <p>Client: {e.projectClient}</p>
                          </Col>
                          <Col md="auto">
                            <p>Completion date: {e.dueDate}</p>
                            <p>Location: {e.projectLocation}</p>
                          </Col>
                        </Row>
                      </Container>
                    )
                  }
                })}
              </div>
            </Container>
          </div>
          
          <Container fluid>
          <h4>Project Resources</h4>
            <Row>
              <Col>
                <div id="mail" className={styles.mailContainer}>
                  <Table>
                    <thead>
                      <tr>
                        <th>
                          Mail
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailData.map((e:any, index:any) => {
                        // If the email is from or to the users current email when logged in and displays it accordingly
                        if(e.to === `${user.email}` || e.sender === `${user.email}`){
                          if(e.project === value){
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
                                  <th>
                                    <a onClick={() => {
                                      console.log(emailData);
                                      // Looping through all of the emails
                                      for(var i=0; i<emailData.length; i++){
                                        console.log(emailData[i])
                                        // If an email matches the email that is clicked on
                                        if(emailData[i].mailID === e.mailID){
                                          console.log("Got it", e.mailID);
                                          // Remove it from the array
                                          emailData.splice(i, 1)
                                          console.log(emailData)
                                          // Break the for loop for better efficiency
                                          break;
                                        }
                                      }
                                      const updateMail = async () => {
                                        return await setDoc(doc(firestore, 'mail', 'mailData'), {
                                          'data': emailData
                                        })
                                      }
                                      updateMail()
                                    }}>Delete</a>
                                  </th>
                                </tr>
                              </div>
                            )
                          }
                          }
                      })}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col>
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
                    if(e.project === value){
                      return(
                        <p key={`${e.dateAdded}_{e.fileName}`}>
                          <div>
                            <div>
                            <Container>
                              <a>{e.fileName}</a>
                              
                                <Button variant="success" size="sm" onClick={ ()=> {
                                    // Create reference to the storage bucket
                                  const storage = getStorage();
                                  // Get the download url from the bucket
                                  getDownloadURL(ref(storage, `files/${e.fileName}`)).then((url:any) => {
                                    // Create a request to the server to download the file and its content
                                    const xhr = new XMLHttpRequest();
                                    xhr.responseType = 'blob';
                                    xhr.onload = (event) => {
                                      const blob = xhr.response;
                                    };
                                    xhr.open('GET', url);
                                    xhr.send();
                                  })
                                }}>
                                  Download
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={ ()=> {
                                  // Writing within an async function for smoother performance
                                  const handleFileDelete = async () => {
                                    // Ref to the database
                                    const firestore = getFirestore(firebase);
                                    // Ref to the storage bucket
                                    const storage = getStorage();
                                    // Ref to a specific file in the storage bucket
                                    const storageRef = ref(storage, `files/${e.fileName}`);
                                    // When all of above is done we'll delete the document in the database
                                    await deleteDoc(doc(firestore, "files", `${e.fileName}`));
                                    // Now we'll delete the file in the storage bucket
                                    deleteObject(storageRef).then(() => {
                                      // Was it successfull?
                                      alert(`Deleted ${e.fileName} successfully`)
                                      console.log(fileData)
                                      // Looping through the file object
                                      for(var i=0; i<fileData.length; i++){
                                        // If it matches any file then delete it
                                        if(fileData[i].fileName === `${e.fileName}`){
                                          fileData.splice(i, 1);
                                          console.log(fileData)
                                          // Break the for loop for effiency
                                          break;
                                        }
                                      }
                                    }).catch((error) => {
                                      // Was there an error
                                      alert("Couldn't delete file")
                                      console.log(error);
                                    })  
        
                                  }
                                  // Running the function
                                  handleFileDelete();
                                }}> Delete</Button>
                              </Container>
                            </div>
                          </div>
                        </p>
                        )
                    }
                    })}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Container>
    
  )
}

export default Dashboard