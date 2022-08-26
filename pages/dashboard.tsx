import React from 'react'
import Email from '../components/Email'
import Calendar from '../components/Calendar'
import Files from '../components/Files'
import styles from '../styles/Dashboard.module.css'

const Dashboard = () => {
  return (
    <div>
      <div id="content" className={styles.contentContainer}>
        <Email></Email>
        <Calendar></Calendar>
        <Files></Files>
      </div>
    </div>
  )
}

export default Dashboard