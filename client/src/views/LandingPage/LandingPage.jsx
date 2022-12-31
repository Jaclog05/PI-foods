import React from "react";
import { Link } from "react-router-dom";
import styles from './LandingPage.module.css'


export default function LandingPage() {
    return(
        <div className={styles.wrapper}>
          <div className={styles.startWrapper}>
              <h2>Henry Food</h2>
              <Link to = "/Home"><button className={styles.button}>Let's GO</button></Link>
          </div>
      </div>
    )
}