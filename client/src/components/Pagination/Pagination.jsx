import React from "react";
import styles from '../../views/Home/Home.module.css'

export default function Pagination ({recipesArray, handleChange}){
    return(
        <div className={Math.ceil(recipesArray.length / 9) ? styles.pages : styles.hideDiv}>
                {
                        Array.from(Array(Math.ceil(recipesArray.length / 9))).map((_, i) => {
                            return (
                                <button name = "pageIndex" key = {i+1} value = {i*9} onClick = {handleChange}>
                                    {i + 1}
                                </button>
                            )
                        })
                }
        </div>
    )
}