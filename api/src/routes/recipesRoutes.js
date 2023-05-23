let express = require('express')
let { Recipe, Diet } = require('../db')
const { Op } = require("sequelize");
const { getRecipes, getRecipeById } = require('../controllers')
const recipesRouter = express.Router()

recipesRouter.get('/', async (req, res) => {

    try{
        const mainData = await getRecipes()
        let { name } = req.query

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
        if(e.response.status === 402){
            return res.status(402).json({message: "Max requests reached. Please try Again Tomorrow"})
        }else{
            return res.status(404).json({message: e.message})
        }
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
            const foundRecipe = await getRecipeById(idReceta)
            return res.status(200).json(foundRecipe)
        }

    }catch(e){
        if(e.response.status === 402){
            return res.status(402).json({message: "Max requests reached. Please try Again Tomorrow"})
        }else{
            return res.status(404).json({message: "Recipe not found"})
        }
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

recipesRouter.delete('/:recipeId', async (req, res) => {
    let { recipeId } = req.params

    try{
        const newRecipe = await Recipe.destroy({
            where: { id: recipeId },
        });
        res.status(200).json(newRecipe);

    }catch(e){
        res.status(404).json({error: e.message})
    }
})

module.exports = recipesRouter