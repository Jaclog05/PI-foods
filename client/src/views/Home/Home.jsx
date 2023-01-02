import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../redux/actions'
import RecipeCard from '../../components/RecipeCard/RecipeCard.jsx'
import styles from './Home.module.css'
import loading from '../../images/loading.gif'
import dietsObj from '../../apiObjects/dietsObj.json'
import alphabetObj from '../../apiObjects/alphabetObj.json'
import healthScoreObj from '../../apiObjects/healthScoreObj.json'

export default function Home() {
    
    const dispatch = useDispatch()

    let recipesArray = useSelector(state => state.recipes)
    let recipesArrayFiltered = useSelector(state => state.filteredRecipes)

    let [homeInfo, setHomeInfo] = React.useState({
        pageIndex: 0,
        nameToFilter: "",
        diets: "",
        sortAlphabet: "",
        sortHealthScore: ""
    })

    const filterCreator = (html, labelM, value, name, disabled, objOptions) => {
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

    const handleFilters = (e) => {
        let {name, value} = e.target
        switch(name){
            case 'diets' :
                setHomeInfo((prev) => ({
                    ...prev,
                    [name]: value
                }))
    
                dispatch(actions.getRecipesByDiet(value)); break;

            case 'sortAlphabet' : 
                setHomeInfo((prev) => ({
                    ...prev,
                    [name]: value,
                    sortHealthScore: ""
                }))
    
                dispatch(actions.orderRecipesAlpabetically(value)); break;
            case 'sortHealthScore' : 
                setHomeInfo((prev) => ({
                    ...prev,
                    [name]: value,
                    sortAlphabet: ""
                }))
    
                dispatch(actions.orderRecipesByHealthscore(value)); break;
            default :
                dispatch(actions.getFilteredRecipes(homeInfo.nameToFilter))
        }
    }
  
    const handleChange = (e) => {
        let {name, value} = e.target
        setHomeInfo((prevHomeInfo) => {
            return {
                ...prevHomeInfo,
                [name]: name === 'nameToFilter' ? value : parseInt(value)
            }
        })
        recipesArray = recipesArrayFiltered
        
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(actions.getFilteredRecipes(homeInfo.nameToFilter))
    }

    React.useEffect(() => {
        dispatch(actions.getAllRecipes())
        dispatch(actions.getAllDiets())
    }, [dispatch])

    return(
        <div className={styles.body}>
            <form onSubmit={handleSubmit} className={styles.searchWrapper}>

                        <div className={styles.searchDiv}>
                            <input className={styles.searchInput} placeholder="Search for recipes..." type="text" name="nameToFilter" value={homeInfo.nameToFilter} onChange={handleChange}/>
                            <input className={styles.searchButton} type="submit" value="Search"/>
                        </div>
                        <div className ={styles.options}>
                            {filterCreator("diet-select", "Order by diet", homeInfo.diets, "diets", false, dietsObj)}
                            {filterCreator("alphabet-select", "Sort alphabetically", homeInfo.sortAlphabet, "sortAlphabet", true, alphabetObj)}
                            {filterCreator("healtScore-select", "Order by healthScore", homeInfo.sortHealthScore, "sortHealthScore", true, healthScoreObj)}
                        </div>

            </form>

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

            <h4 className={recipesArray.length ? styles.selectedPage : styles.hideDiv}>
                Page {(homeInfo.pageIndex / 9) + 1} of {Math.ceil(recipesArray.length / 9)}
            </h4>

            <div className={styles.wrapper}>
                {Array.isArray(recipesArray) ?
                    (!recipesArray.length ?

                        !homeInfo.diets.length ?
                            <div className={styles.backgroundLoading}><img alt="loading..." src={loading} /> </div> 
                        :
                        <h1 className={styles.noResults}>No {homeInfo.diets} recipes found</h1>
                    :
                            recipesArray.slice(homeInfo.pageIndex, (homeInfo.pageIndex + 9)).map((m, i) => <Link key={i} to={`/recipe/${m.id}`} className={styles.links}>
                                                    <RecipeCard 
                                                        key={i}
                                                        id={m.id}
                                                        name={m.name}
                                                        image={m.image}
                                                        diet={m.diets}
                                                        healthScore={m.healthScore}
                                                    />
                                        </Link>
                            )
                    
                    ) 
                :
                    <h1 className={styles.noResults}>{recipesArray.message}</h1>
                }
                
            </div>
        </div>
    )
}