const { Recipe } = require("../db");
const { Dieta } = require("../db");

const { v4: uuidv4 } = require("uuid");

const recipeId = async (req, res) => {
  try {
    const { title, image, summary, healthScore, analyzedInstructions, dieta } =
      req.body;

    if (
      ![title, image, summary, healthScore, analyzedInstructions].every(Boolean)
    )
      throw Error("Faltan datos importantes");
    const [newRecipe, created] = await Recipe.findOrCreate({
      where: {
        title,
        image,
        summary,
        healthScore,
        analyzedInstructions,
      },
    });
    if(dieta && dieta.length > 0) {
      const selectDiets = await Dieta.findAll({
        where: { id: dieta}
      })
      console.log(selectDiets);
      await newRecipe.setDieta(selectDiets)
    }
    res.status(200).json(newRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  recipeId,
};
