import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';

import styles from '../styles/Dashboard.module.css';
import firebase from '../firebase/firebase';
import {Button, Form} from 'react-bootstrap'
import { useAuth } from '../context/AuthContext';

import mailData from "../data/mail"
import updateMailData from "../data/mail"

const SendMail = () => {

    // Creates reference to the database and current user
    const firestore = getFirestore(firebase);
    const {user} = useAuth();

    // Listens to inputs from the form
    const emailInputReference:any = useRef(null)
    const subjectInputReference:any = useRef(null)
    const contentInputReference:any = useRef(null);

    // When the user submits a new local object is created and is pushed into the mail data array
    const submitMail = async () => {
        var object = {
            project: "Test Project",
            mailID: "Test",
            sender: user.email,
            subject: subjectInputReference.current.value,
            to: emailInputReference.current.value,
            content: contentInputReference.current.value
        }
        mailData.push(object);

        // Once all the local data storage is completed the data will then be stored in firebase
        return await setDoc(doc(firestore, 'mail', 'mailData'), {
            'data': mailData
        })

        updateMailData();
    }

    return(
        <div className={styles.mailFormContainer}>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Email Address:</Form.Label> 
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
                <Button variant="primary" type="submit" onClick={submitMail}>Submit</Button>
            </Form>
        </div>
    )
}

export default SendMail;