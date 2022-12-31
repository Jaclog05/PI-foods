import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../redux/actions'
import RecipeCard from '../../components/RecipeCard/RecipeCard.jsx'
import styles from './Home.module.css'
import loading from '../../images/loading.gif'
import dietsObj from '../../apiObjects/dietsObj.json'
// import store from '../../redux/store'

export default function Home() {
    
    const dispatch = useDispatch()

    let details = useSelector(state => state.recipes)
    let detailsFiltered = useSelector(state => state.filteredRecipes)

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
                [name]: name === 'nameToFilter' ? value : parseInt(value),
            }
        })
        details = detailsFiltered
        
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
                            <label htmlFor="diet-select">Order by diet:
                                <select value={homeInfo.diets} className={homeInfo.diets.length ? styles.optionSelected : styles.noSelectedOption} name="diets" id="diet-select" onChange={handleFilters}>
                                    <option disabled={false}  value="">--Please choose an option--</option>
                                    {Object.keys(dietsObj).map((key, i) => <option key={i} name="diets" value={key}>{key}</option>)}
                                </select>
                            </label>


                            <label htmlFor="alphabet-select">Sort alphabetically:
                                <select value={homeInfo.sortAlphabet} className={homeInfo.sortAlphabet.length ? styles.optionSelected : styles.noSelectedOption} name="sortAlphabet" id="alphabet-select" onChange={handleFilters}>
                                    <option disabled={true} value="">--Please choose an option--</option>
                                    <option value="a-z">A - Z</option>
                                    <option value="z-a">Z - A</option>
                                </select>
                            </label>


                            <label htmlFor="healtScore-select">Order by healthScore:
                                <select value={homeInfo.sortHealthScore}  className={homeInfo.sortHealthScore.length ? styles.optionSelected : styles.noSelectedOption} name="sortHealthScore" id="healtScore-select" onChange={handleFilters}>
                                    <option disabled={true} value="">--Please choose an option--</option>
                                    <option value="ascendant">Ascendant</option>
                                    <option value="descendant">Descendant</option>
                                </select>
                            </label>
                        </div>

            </form>
            <div className={styles.pages}>
                {Math.ceil(details.length / 9) ? Array.from(Array(Math.ceil(details.length / 9))).map((_, i) => <button name="pageIndex" key={i+1} value={i*9} onClick={handleChange}>{i + 1}</button>) :
                <div style={{display: 'none'}}></div>
                }
            </div>
            {details.length ? <h4 className={styles.selectedPage}>Page {(homeInfo.pageIndex / 9) + 1} of {Math.ceil(details.length / 9)}</h4> : <div style={{display: 'none'}}></div>}

            <div className={styles.wrapper}>
                {Array.isArray(details) ?
                    (!details.length ?

                        !homeInfo.diets.length ? <div className={styles.backgroundLoading}><img alt="loading..." src={loading} /> </div> :
                        <h1 className={styles.noResults}>No {homeInfo.diets} recipes found</h1> :
                            details.slice(homeInfo.pageIndex, (homeInfo.pageIndex + 9)).map((m, i) => <Link key={i} to={`/recipe/${m.id}`} className={styles.links}>
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
                    
                    ) :
                    <h1 className={styles.noResults}>{details.message}</h1>
                }
                
            </div>
        </div>
    )
}