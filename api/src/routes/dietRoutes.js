let express = require('express')
let { Diet } = require('../db')
const { createDiets } = require('../controllers')

const dietRouter = express.Router()


dietRouter.get('/', async (req, res) => {

    const { count, rows } = await Diet.findAndCountAll();

    if (count === 0 && !rows.length) {

        const formatForDb = createDiets()
        const dietsOnDb = await Diet.bulkCreate(formatForDb)   
        return res.status(201).json(dietsOnDb)

    }else{
        const dietsOnDb = await Diet.findAll()
        return res.status(201).json(dietsOnDb)
    }

})

module.exports = dietRouter