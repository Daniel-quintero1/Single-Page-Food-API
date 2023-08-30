const { Recipe } = require("../db");
const { Dieta } = require("../db");
const axios = require("axios");
const { API_KEY } = process.env;

const getRecipeById = async (idRecipe, source) => {
  let receta;
  if (source === "api") {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${idRecipe}/information?apiKey=${API_KEY}`
    );
    receta = {
      id: response.data.id,
      title: response.data.title,
      image: response.data.image,
      summary: response.data.summary.replace(
        /<("[^"]*"|'[^']*'|[^'">])*>/g,
        ""
      ),
      healthScore: response.data.healthScore,
      analyzedInstructions: response.data.analyzedInstructions.map(
        (instruction) => {
          return {
            steps: instruction.steps.map(
              (step) => `${step.number}. ${step.step}`
            ),
          };
        }
      ),
      diets: response.data.diets,
      created: false,
    };
  } else {
    const recipe = await Recipe.findByPk(idRecipe, {
      include: [
        {
          model: Dieta,
          attributes: ["title"],
          through: { attributes: [] },
        },
      ],
    });
    receta = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      analyzedInstructions: recipe.analyzedInstructions,
      dieta: recipe.dieta ? recipe.dieta.map((d) => d.title) : [],
      created: true,
    };
    console.log(receta);
  }

  return receta;
};

//traigo el name de la base de la api + las propiedades que quiero mostrar
const getApiInfo = async () => {
  const apiUrl = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&number=100&apiKey=${API_KEY}`
  );
  const apiInfo = await apiUrl.data.results.map((x) => {
    return {
      id: x.id,
      title: x.title,
      image: x.image,
      summary: x.summary,
      healthScore: x.healthScore,
      analyzedInstructions: x.analyzedInstructions.map(
        (instruction) => {
          return {
            steps: instruction.steps.map(
              (step) => `${step.number}. ${step.step}`
            ),
          };
        }
      ),
      diets: x.diets,
      created: false,
    };
  });

  return apiInfo;
};

//traigo la informacion de la Bdd
const getDbInfo = async () => {
  return await Recipe.findAll({
    include: {
      model: Dieta,
      attributes: ["title"],
      through: {
        attributes: [],
      },
    },
  });
};
//traigo toda la informacion
const getAllRecipes = async () => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const infoTotal = dbInfo.concat(apiInfo);
  return infoTotal;
};

module.exports = {
  getRecipeById,
  getAllRecipes,
  getDbInfo,
  getApiInfo,
};
