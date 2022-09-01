import React, { useState } from 'react';
import styles from '../styles/Dashboard.module.css';
import firebase from '../firebase/firebase';
import testData from '../data/mail'
import Mail from '../components/Mail'
import {addDoc, collection, doc, getDoc, setDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, updateDoc, where} from 'firebase/firestore';

const Dashboard = () => {
  // Getting the firebase config
  const firestore = getFirestore(firebase);

  // Dynamically show and hide components
  const [isShown, setIsShown] = useState(false);
  const handleClick = (event:any)  => {
    setIsShown((current:any) => !current);
  }

  return (
    <div>
      <select>
        <option disabled selected>Select Project</option>
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
            {testData.map((e:any) => {
              return(
                <Mail name={e.name} content={e.content}/>
              )
            })}
          </div>
        </div>
        <div id="calendar" className={styles.calendarContainer}>
          <div style={{borderBlockEnd:'1px solid black'}}>
            <h1>Calendar</h1>
          </div>
        </div>
        <div id="files" className={styles.fileContainer}>
          <div style={{borderBlockEnd:'1px solid black'}}>
            <h1>Files</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard