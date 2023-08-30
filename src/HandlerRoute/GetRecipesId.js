const axios = require("axios");
const { Recipe } = require("../db");
const { v4: uuidv4 } = require("uuid");
const {getRecipeById} = require("../Controllers/ControllersGet")

// https://api.spoonacular.com/recipes/{id}/information
//https://api.spoonacular.com/recipes/2/information?includeNutrition=true&apiKey=${API_KEY}
//`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`

const Id_recipe = async (req, res) => {
  const { idRecipe } = req.params;
  const source = isNaN(idRecipe) ? "bdd" : "api"

   try {
    const recetas = await getRecipeById(idRecipe, source)
    res.status(200).json(recetas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  Id_recipe,
};
