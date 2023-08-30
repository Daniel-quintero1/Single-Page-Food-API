const { Recipe } = require("../db");
const {getRecipeById} = require("../Controllers/ControllersGet")

//logica unicamente para eleminar de Bdd
const deleteRecipe = async (req, res) => {

const { idRecipe } = req.params;
const source = isNaN(idRecipe) ? "bdd" : "api"

 try {
  const recetas = await getRecipeById(idRecipe, source)
  await recetas.destroy({
          where: { idRecipe },
        });
  res.status(200).json("Recipe successfully removed");
} catch (error) {
  res.status(400).json({ error: error.message });
}
};

module.exports = {
    deleteRecipe
  };
