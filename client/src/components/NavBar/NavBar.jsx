import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from './NavBar.module.css'

export default function NavBar() {

    const location = useLocation()

    if(location.pathname === '/') {
      return null
    }

    return(
        <div className={styles.wrapper}>
              <Link to="/Home" className={styles.links}>Home</Link>
              <h4>Henry Food</h4>
              <Link to="/create" className={styles.links}>Create a Recipe</Link>
        </div>
    )
}