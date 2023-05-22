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
import Filter from '../../components/Filters/Filter'
import Pagination from '../../components/Pagination/Pagination'

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


    //intenta hacer que se carguen las recetas y las dietas una sola vez. No cada vez que se 
    //recargue la pagina. Mira lo del localStorage o algo.
    
    React.useEffect(() => {
        dispatch(actions.getAllRecipes())
    }, [])



    return(
        <div className={styles.body}>
            <form onSubmit={handleSubmit} className={styles.searchWrapper}>

                        <div className={styles.searchDiv}>
                            <input 
                                className={styles.searchInput} 
                                placeholder="Search for recipes..." 
                                type="text" 
                                name="nameToFilter" 
                                value={homeInfo.nameToFilter} 
                                onChange={handleChange}
                            />
                            <input className={styles.searchButton} type="submit" value="Search"/>
                        </div>

                        <div className ={styles.options}>
                            <Filter 
                                html="diet-select" 
                                labelM="Order by diet" 
                                value={homeInfo.diets} 
                                name="diets" 
                                disabled={false} 
                                objOptions={dietsObj} 
                                handleFilters={handleFilters}
                            />
                            <Filter 
                                html="alphabet-select" 
                                labelM="Sort alphabetically" 
                                value={homeInfo.sortAlphabet} 
                                name="sortAlphabet" 
                                disabled={true} 
                                objOptions={alphabetObj} 
                                handleFilters={handleFilters}
                            />
                            <Filter 
                                html="healtScore-select" 
                                labelM="Order by healthScore" 
                                value={homeInfo.sortHealthScore} 
                                name="sortHealthScore" 
                                disabled={true} 
                                objOptions={healthScoreObj} 
                                handleFilters={handleFilters}
                            />
                        </div>

            </form>

            { Array.isArray(recipesArray) && <Pagination recipesArray={recipesArray} handleChange={handleChange}/> }

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
                            recipesArray.slice(homeInfo.pageIndex, (homeInfo.pageIndex + 9)).map((m, i) => (
                                    <Link key={i} to={`/recipe/${m.id}`} className={styles.links}>
                                                    <RecipeCard 
                                                        key={i}
                                                        id={m.id}
                                                        name={m.name}
                                                        image={m.image}
                                                        diet={m.diets}
                                                        healthScore={m.healthScore}
                                                        handleClosing={typeof (m.id) !== 'number' && (() => dispatch(actions.deleteRecipe(m.id)))}
                                                    />
                                        </Link>
                                    )
                            )
                    ) 
                :
                    <h1 className={styles.noResults}>{recipesArray.message}</h1>
                }
                
            </div>
        </div>
    )
}