import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../redux/actions'
import styles from './Home.module.css'
import loading from '../../images/loading.gif'
import RecipeCard from '../../components/RecipeCard/RecipeCard.jsx'
import Filter from '../../components/Filters/Filter.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import filtersInfo from '../../apiObjects/filtersInfo.json'
import objOptions from '../../apiObjects/objOptions.json'

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

    //Ojo que las dietas no cargan en el Home. Debe ser porque borraste eso del useEffect
    //dispatch(actions.getAllDiets())
    
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
                            {filtersInfo.map((filter, i) => {
                                return(
                                    <Filter
                                        html={filter.html}
                                        labelM={filter.labelM}
                                        name={filter.name}
                                        value={homeInfo[`${filter.name}`]}
                                        disabled={filter.disabled}
                                        handleFilters={handleFilters}
                                        objOptions={objOptions[i]}
                                    />
                                )
                            })}
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
                                                        handleClosing={ typeof(m.id) !== 'number' && 
                                                                            (() => dispatch(actions.deleteRecipe(m.id)))
                                                                      }
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