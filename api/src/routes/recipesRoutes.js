require('dotenv').config();
let express = require('express')
let { Recipe, Diet } = require('../db')
let axios = require('axios')
const { Op } = require("sequelize");

const {
    YOUR_API_KEY
  } = process.env;

const recipesRouter = express.Router()

recipesRouter.get('/', async (req, res) => {


    try{
        let { name } = req.query

        let response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${YOUR_API_KEY}&number=${100}&addRecipeInformation=true`)
        let respuesta = await response.data.results

        let mainData = respuesta.map(recipe => {
            return {
                id: recipe.id,
                name: recipe.title,
                image: recipe.image,
                name: recipe.title,
                dishType: recipe.dishTypes,
                summarizeDish: recipe.summary,
                healthScore: recipe.healthScore,
                steps: !recipe.analyzedInstructions.length ?
                recipe.analyzedInstructions[0] :
                recipe.analyzedInstructions[0].steps.map(steps => `${steps.number}. ${steps.step}`),
                diets: recipe.diets
            }
        })

        if(!name){
            let recipesOnDb = await Recipe.findAll({
                include: [
                    {
                        model: Diet,
                        attributes: ["name"],
                        through: {
                            attributes: []
                        }
                    }
                ]
            })
            let reverse = recipesOnDb.reverse()
            return res.status(200).json([...reverse, ...mainData])

        }else{
                let filteredApi = mainData.filter(recipe => recipe.name.toLowerCase().includes(name.toLowerCase()))
                let filteredOnDb = await Recipe.findAll({
                    where: {
                        name: {
                            [Op.iLike]: `%${name}%`
                        }
                    }
            });

            let totalFiltered = [...filteredOnDb, ...filteredApi]

            if(totalFiltered.length)
                return res.status(200).json(totalFiltered)
            else{
                return res.status(200).json({message: "No results found"})
            }

        }

    }catch(e){
        return res.status(404).json({error: e.message})
    }
})

recipesRouter.get('/:idReceta', async (req, res) => {
    try{

        let { idReceta } = req.params

        if(isNaN(idReceta)){
            
            let clickedRecipe = await Recipe.findByPk(idReceta, {
                include: [
                    {
                        model: Diet,
                        attributes: ["name"],
                        through: {
                            attributes: []
                        }
                    }
                ]
            })
            return res.status(200).json(clickedRecipe)
        }else{
            
            let response = await axios.get(`https://api.spoonacular.com/recipes/${idReceta}/information?apiKey=${YOUR_API_KEY}`)
            let respuesta = await response.data

            if(!respuesta.length){
                let mainData = {
                    image: respuesta.image,
                    name: respuesta.title,
                    dishType: respuesta.dishTypes,
                    diets: respuesta.diets,
                    summarizeDish: respuesta.summary,
                    healthScore: respuesta.healthScore,
                    steps: !respuesta.analyzedInstructions.length ?
                                respuesta.analyzedInstructions[0] :
                                respuesta.analyzedInstructions[0].steps.map(steps => steps.step)

                }
                return res.status(200).json(mainData)

            }else{
                
                return res.status(200).send('No matches found')

            }
        }

    }catch(e){
        return res.status(404).json(e)
    }
})

recipesRouter.post('/', async (req, res) => {
    let {name, summarizeDish, healthScore, steps, image, dishType, dietId} = req.body 
    try{

        if(!name){
            return res.status(200).send("Please add a recipe name")
        }

        if(!summarizeDish){
            return res.status(200).send("Please add a recipe summary")
        }

        const newRecipe = await Recipe.create({
            name,
            summarizeDish,
            healthScore,
            steps,
            image,
            dishType
        });

        await newRecipe.addDiets(dietId)

        res.status(200).json(newRecipe);

    }catch(e){
        res.status(404).json({error: e.message})
    }
})

module.exports = recipesRouter