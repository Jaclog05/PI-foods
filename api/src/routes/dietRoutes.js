let express = require('express')
let { Diet } = require('../db')

const dietRouter = express.Router()

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

dietRouter.get('/', async (req, res) => {

    const { count, rows } = await Diet.findAndCountAll();

    if (count === 0 && !rows.length) {

        let formatForDb = Object.keys(dietsObj).map(item => {
            return {
                name: item
            }
        })
    
        const dietsOnDb = await Diet.bulkCreate(formatForDb)
        
        return res.status(201).json(dietsOnDb)

    }else{
        const dietsOnDb = await Diet.findAll()
        return res.status(201).json(dietsOnDb)
    }

})

module.exports = dietRouter