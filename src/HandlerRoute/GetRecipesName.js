 const {
  getAllRecipes,
} = require("../Controllers/ControllersGet");

const recipeName = async (req, res) => {
  const { title } = req.query;
  let allRecipes = await getAllRecipes();

  if (title) {
    let recipeTitles = await allRecipes.filter ((e) =>
      e.title.toLowerCase().includes(title.toLocaleLowerCase())
    );
    recipeTitles.length
      ? res.status(200).send(recipeTitles)
      : res.status(404).send("Recipe not found");
  } else {
    res.status(200).send(allRecipes);
  }
};

module.exports = {
  recipeName,
};
