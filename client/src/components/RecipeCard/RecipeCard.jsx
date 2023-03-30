import React from "react";
import styles from './RecipeCard.module.css';
import defaultNewRecipe from '../../images/defaultNewRecipe.png'
import { useDispatch } from 'react-redux';
import * as actions from "../../redux/actions";


function GameCard({id, name, image, diet, healthScore}) {

  const dispatch = useDispatch()

  const handleClick = (event) => {
    event.preventDefault()
    dispatch(actions.deleteRecipe(id))
  } 

  return (
    <div className={styles.wrapper}>
        <div className={styles.upper}>
            <div>{healthScore}</div>
            <h4 style={{margin: 4}}>{name}</h4>
            {typeof id !== 'number' && <button onClick={handleClick}>x</button>}
        </div>
        <img className={styles.images} src={image ? image : defaultNewRecipe} alt={name} width="210" height="140"/>
        <div className={styles.genresDiv}>
            {diet && diet.map((m, i) => <span key={i}>{`• ${typeof m === 'string' ? m : m.name}`}</span>)}
        </div>
    </div>
  );
  }
  export default GameCard;