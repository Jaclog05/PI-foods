import React from "react";
import styles from '../../views/Home/Home.module.css'

export default function filterCreator ({html, labelM, value, name, disabled, objOptions, handleFilters}) {
    return (
        <label htmlFor={html}>{labelM}:
                            <select 
                                value = {value} 
                                className = {value.length ? styles.optionSelected : styles.noSelectedOption} 
                                name = {name} 
                                id = {html} 
                                onChange = {handleFilters}
                            >
                                    <option disabled={disabled} value="">--Please choose an option--</option>
                                    {Object.keys(objOptions).map((key, i) => <option key={i} name={name} value={key}>{key}</option>)}
                            </select>
        </label>
    )
}