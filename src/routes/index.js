const { Router } = require("express");
const { Id_recipe } = require("../HandlerRoute/GetRecipesId");
const { recipeName } = require("../HandlerRoute/GetRecipesName");
const { recipeId } = require("../HandlerRoute/PostRecipes");
const { newDiet } = require("../HandlerRoute/GetDiets");
const {deleteRecipe }= require("../HandlerRoute/DeleteRecipe");

const router = Router();

router.post("/recipes", recipeId);
router.get("/recipes", recipeName);
router.get("/recipes/:idRecipe", Id_recipe); 
router.get("/diets", newDiet)
router.delete("/recipes/:idRecipe", deleteRecipe)//elimina unicamente de Bdd

module.exports = router;
