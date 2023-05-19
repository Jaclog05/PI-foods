
const sortByAlphabet = (array, type) => {
    if(type === 'A - Z'){
        array.sort((a, b) => {
            if(a.name > b.name) return 1
            if(a.name < b.name) return -1
            return 0
        })
        return array
    }else {
        array.sort((a, b) => {
            if(a.name > b.name) return -1
            if(a.name < b.name) return 1
            return 0
        })
        return array
    }
}

const sortByHealthScore = (array, type) => {
    if(type === 'Ascendant'){
        array.sort((a, b) => a.healthScore - b.healthScore)
        return array
    }else {
        array.sort((a, b) => b.healthScore - a.healthScore)
        return array
    }
}

module.exports = {
    sortByAlphabet,
    sortByHealthScore
}