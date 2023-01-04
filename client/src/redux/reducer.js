import { GET_ALL_RECIPES } from './actions';
import { GET_RECIPE_DETAILS } from './actions';
import { CREATE_RECIPE } from './actions';
import { GET_FILTERED_RECIPES } from './actions'
import { GET_RECIPES_BY_DIET } from './actions';
import { ORDER_RECIPES_ALPHABETICALLY } from './actions';
import { ORDER_RECIPES_BY_HEALTHSCORE } from './actions';
import { GET_ALL_DIETS } from './actions'

const initialState = {
  recipes: [],
  recipesCopy: [],
  recipeDetail: {},
  lastCreatedRecipe: {},
  filteredRecipes: [],
  diets: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {

    case GET_ALL_RECIPES:
        return {
          ...state,
          recipes: action.payload,
          recipesCopy: action.payload
        }
    case GET_ALL_DIETS:
        return {
          ...state,
          diets: action.payload
        }
    case GET_RECIPE_DETAILS:
        return {
          ...state,
          recipeDetail: action.payload
        }
    case CREATE_RECIPE:
        return {
          ...state,
          lastCreatedRecipe: action.payload.data
        }
    case GET_FILTERED_RECIPES:
        return {
          ...state,
          recipes: action.payload
        }
    case GET_RECIPES_BY_DIET:
        return {
          ...state,
          recipes:  action.payload.length ? 
                    state.recipesCopy.filter(rec => rec.diets.indexOf(action.payload) !== -1) :
                    state.recipesCopy
        }
    case ORDER_RECIPES_ALPHABETICALLY:
        return {
          ...state,
          recipes: action.payload === 'A - Z' ? state.recipes.sort((a, b) => {
                                                          if(a.name > b.name) return 1
                                                          if(a.name < b.name) return -1
                                                          return 0
                                                      }) :
                                                      state.recipes.sort((a, b) => {
                                                          if(a.name > b.name) return -1
                                                          if(a.name < b.name) return 1
                                                          return 0
                                                      })
        }
    case ORDER_RECIPES_BY_HEALTHSCORE:
        return {
          ...state,
          recipes: action.payload === 'Ascendant' ? state.recipes.sort((a, b) => a.healthScore - b.healthScore):
                                                            state.recipes.sort((a, b) => b.healthScore - a.healthScore) 
        }
    default:
        return state
  
  }
};

export default rootReducer;