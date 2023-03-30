import axios from "axios";

export const GET_ALL_RECIPES = "GET_ALL_RECIPES";
export const GET_ALL_DIETS = 'GET_ALL_DIETS'
export const GET_RECIPE_DETAILS = "GET_RECIPE_DETAILS";
export const CREATE_RECIPE = "CREATE_RECIPE";
export const GET_FILTERED_RECIPES = "FILTER_RECIPES"
export const GET_RECIPES_BY_DIET = "GET_RECIPES_BY_DIET";
export const ORDER_RECIPES_ALPHABETICALLY = "ORDER_RECIPES_ALPHABETICALLY";
export const ORDER_RECIPES_BY_HEALTHSCORE = "ORDER_RECIPES_BY_HEALTHSCORE";
export const DELETE_RECIPE = "DELETE_RECIPE"



export const getAllRecipes = () => {
    return dispatch => {
        return fetch(`http://localhost:3001/recipes`)
                .then(response => response.json())
                .then(json => dispatch({type: GET_ALL_RECIPES, payload: json}))
      };
};

export const getAllDiets = () => {
    return dispatch => {
        return fetch(`http://localhost:3001/diets`)
                .then(response => response.json())
                .then(json => dispatch({type: GET_ALL_DIETS, payload: json}))
      };
};

export const getFilteredRecipes = (name) => {
    return dispatch => {
        return fetch(`http://localhost:3001/recipes?name=${name}`)
                .then(response => response.json())
                .then(json => dispatch({
                    type: GET_FILTERED_RECIPES, payload: json}))
      };
};

export const getRecipesByDiet = (diet) => {
    return dispatch => {
        return dispatch({type: GET_RECIPES_BY_DIET, payload: diet})
      };
};

export const orderRecipesAlpabetically = (typeOfSort) => {
    return dispatch => {
        return dispatch({type: ORDER_RECIPES_ALPHABETICALLY, payload: typeOfSort})
      };
};

export const orderRecipesByHealthscore = (typeOfSort) => {
    return dispatch => {
        return dispatch({type: ORDER_RECIPES_BY_HEALTHSCORE, payload: typeOfSort})
      };
};

export const getRecipeDetails = (id) => { 
    return dispatch => {
        
        return fetch(`http://localhost:3001/recipes/${id}`)
                .then(response => response.json())
                .then(json => dispatch({type: GET_RECIPE_DETAILS, payload: json}))

      };
};

export const createRecipe = (args) => {

    return dispatch => {
        
        return axios({
            method: "post",
            url: "http://localhost:3001/recipes",
            data: args
          })
            .then(json => dispatch({type: CREATE_RECIPE, payload: json}))
            .catch(response => console.log(response))
    };
}


export const deleteRecipe = (id) => {

    return dispatch => {
        
        return axios.delete(`http://localhost:3001/recipes/${id}`)
            .then(json => dispatch({type: DELETE_RECIPE, payload: json}))
            .catch(response => console.log(response))
    };
}
