import React from "react";
import styles from './CreateRecipe.module.css'
import { useDispatch } from 'react-redux';
import * as actions from "../../redux/actions";
import dietsJson from '../../apiObjects/dietsObj.json'
import dishTypesJson from '../../apiObjects/dishTypes.json'

export default function CreateRecipe() {

    const dietsObjInitialState = dietsJson;
    const dishTypesInitialState = dishTypesJson;
    const dispatch = useDispatch()
    
    const [newRecipe, setNewRecipe] = React.useState({
      name: "",
      summarizeDish: "",
      healthScore: "",
      image: "",
      dishType: [],
      steps: [],
      dietId: []
    })

    const [error, setError] = React.useState({
        nameError: true,
        summaryError: true
    })

   const [dietsObj, setDietsObj] = React.useState(dietsJson)
   const [dishTypesObj, setDishTypesObj] = React.useState(dishTypesJson)

   React.useEffect(() => {
        setNewRecipe((prevState) => {
            return {
                ...prevState,
                dietId: Object.keys(dietsObj).map(m => typeof dietsObj[m] === 'string' ? dietsObj[m] : false).filter(m => m),
                dishType: Object.keys(dishTypesObj).filter(key => dishTypesObj[key])
            }
        })
    }, [dietsObj, dishTypesObj])

   const handleChange = (e) => {
        let {name, type, value, id, files} = e.target;

        if(type === 'file'){
                if(files && files[0]){
                    let img = files[0]
                    setNewRecipe({
                        ...newRecipe,
                        image: URL.createObjectURL(img)
                    })
                }
        }

        switch(name){
            case 'dishTypes': 
                    setDishTypesObj((prevState) => {
                            return {
                                ...prevState,
                                [value]: !prevState[value]
                            } 
                         }  
                    ); break;
            case 'diets':
                    setDietsObj((prevState) => {
                            return {
                                ...prevState,
                                [value]: !prevState[value] ? id : false
                            } 
                        }  
                    ); break;
            case 'image': 
                    console.log(files[0]); break;
            case 'steps':
                    setNewRecipe((prevState) => {
                            return {
                                ...prevState,
                                steps: value.split(",")
                            } 
                    }  
                    ); break;
            default:
                    setNewRecipe((prevState) => {
                            return {
                                ...prevState,
                                [name]: value
                            } 
                    },
                    setError((prevState) => {
                        return {
                            ...prevState,
                            [id]: value ? false : true
                        }
                    }) 
            );       
        }
    }

   const handleSubmit = (e) => {
      e.preventDefault()
      if(error.nameError || error.summaryError){
         return alert("Missing Data") 
      }else{
        dispatch(actions.createRecipe(newRecipe))
        setNewRecipe({
                name: "",
                summarizeDish: "",
                healthScore: "",
                image: "",
                dishType: [],
                steps: [],
                dietId: []
        })
        setDietsObj(dietsObjInitialState)
        setDishTypesObj(dishTypesInitialState)
        return alert("New Recipe added Successfully!")
      }
   }

    return(
        <div className={styles.background}>
          <div className={styles.title}>
                    <h1>Add Your Own Recipes!!</h1>
          </div>
          <form onSubmit={handleSubmit} className={styles.wrapper}>
                <label className={styles.labelName}>Recipe Name * 
                    <input className={error.nameError && styles.errorForm} type="text" name="name" id="nameError" value={newRecipe.name} onChange={handleChange}/>
                </label>
                <label className={styles.labelHealth}>Health Score 
                    <input type="number" name="healthScore" value={newRecipe.healthScore} onChange={handleChange} />
                </label>
                <label className={styles.labelSummarize}>Summarize * 
                    <input className={error.summaryError && styles.errorForm} type="textarea" name="summarizeDish" id="summaryError" value={newRecipe.summarizeDish} onChange={handleChange}/>
                </label>
                <label className={styles.labelSteps}>Steps
                    <input type="textarea" step="0.01" name="steps" value={newRecipe.steps} onChange={handleChange}/>
                </label>

                <div className={styles.middle}>
                    <label htmlFor="filesSelected">Choose a recipe image</label>
                    <input className={styles.uploadButton} type="file" name="image" accept="image/png, image/jpeg" onChange={handleChange}></input>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.diets}>
                            <label>Diet/s </label><br/>
                            <div className={styles.wrapperDiets}>
                                {Object.keys(dietsObj).map((m, i) => <label key={i} ><input type="checkbox" id={i+1} name="diets" checked={dietsObj[m]} value={m} onChange={handleChange}  key={i}/>{m}</label>)}
                            </div>
                    </div>
                    <div className={styles.diets}>
                        <label>Dish Type/s </label><br/>
                        <div className={styles.wrapperDiets}>
                            {Object.keys(dishTypesObj).map((m, i) => <label key={i} ><input type="checkbox" name="dishTypes" checked={dishTypesObj[m]} value={m} onChange={handleChange}  key={i}/>{m}</label>)}
                        </div>
                </div>
                </div>
                <input className ={styles.submit} type="submit" value="Create Recipe"/>
            </form>
            <div className={styles.mandatory}>* Mandatory data</div>
        </div>
    )
}