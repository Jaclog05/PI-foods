let axios = require('axios')
require('dotenv').config();
const {
    API_DOMAIN,
    YOUR_API_KEY
} = process.env;


const dietsObj = {
    "gluten free": false,
    "ketogenic": false,
    "vegetarian": false,
    "lacto-vegetarian": false,
    "ovo-vegetarian": false,
    "vegan": false,
    "pescetarian": false,
    "paleo": false,
    "paleolithic": false,
    "primal": false,
    "low FODMAP": false,
    "whole30": false
}

const mainDataFunction = (recipe) => {
    return {
        id: recipe.id,
        name: recipe.title,
        image: recipe.image,
        dishType: recipe.dishTypes,
        summarizeDish: recipe.summary,
        healthScore: recipe.healthScore,
        steps: !recipe.analyzedInstructions.length ?
            recipe.analyzedInstructions[0] :
            recipe.analyzedInstructions[0].steps.map(steps => `${steps.number}. ${steps.step}`),
        diets: recipe.diets
    }
}

const createDiets = () => {
    let formatForDb = Object.keys(dietsObj).map(item => {
        return {
            name: item
        }
    })
    return formatForDb
}

const getRecipes = async() => {
        let response = await axios.get(`
            ${API_DOMAIN}complexSearch?apiKey=${YOUR_API_KEY}&number=${100}&addRecipeInformation=true`
        )
        let respuesta = await response.data.results
        let mainData = respuesta.map(recipe => mainDataFunction(recipe))
        return mainData
}

const getRecipeById = async(idReceta) => {
        let response = await axios.get(`${API_DOMAIN}${idReceta}/information?apiKey=${YOUR_API_KEY}`)
        let respuesta = await response.data
        
        if(!response.hasOwnProperty('code')){
            const res = mainDataFunction(respuesta)
            return res
        }else{
            return {error: "Recipe not found"}
        }
}

module.exports = {
    createDiets,
    getRecipes,
    getRecipeById
}