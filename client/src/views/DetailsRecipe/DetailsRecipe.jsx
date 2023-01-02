import React from "react";
import styles from "./DetailsRecipe.module.css"
import { useSelector, useDispatch } from "react-redux";
import * as actions from '../../redux/actions'
import defaultImage from '../../images/defaultNewRecipe.png'

export default function DetailsRecipe({id}) {

    const dispatch = useDispatch()
    let details = useSelector(state => state.recipeDetail)

    React.useEffect(() => {
        
        dispatch(actions.getRecipeDetails(id))
    }, [dispatch, id])

    return(
        <div className={styles.background}>
        <div className={styles.wrapper}>
            <div className={styles.upper}>
                <h3>{`${details.name}`}</h3>
            </div>
            <div className={styles.middle}>
                <img className={styles.images} src={!details.image ? defaultImage : details.image} alt={details.name} width="500" height="333"/>
                <div className={styles.dishType}>
                    <h4>Dish Type </h4>
                    {details.dishType && details.dishType.map((dish, i) => <li key={i}>{dish}</li>)}
                </div>
                <div className={styles.dietType}>
                    <h4>Diet Type </h4>
                    {details.diets && details.diets.map((diet, i) => <li key={i}>{typeof diet === 'string' ? diet : diet.name}</li>)}
                </div>
                <div className={styles.healthScore}>
                    <h4>Health Score</h4>
                    <div>{details.healthScore}</div>
                </div>
                <div className={styles.summary}>
                    <h4>SummaryDish </h4>
                    <div dangerouslySetInnerHTML={{__html: details.summarizeDish}} />
                </div>
            </div>
            <hr className={styles.break}/>
            <div className={details.steps ? styles.bottom : styles.noSteps}>
                <h4>Steps: </h4>
                <ol className={styles.list}>
                    {details.steps && details.steps.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
            </div>
        </div>
    </div>
    )
}