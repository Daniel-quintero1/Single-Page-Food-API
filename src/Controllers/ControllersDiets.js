const axios = require("axios");
const { Dieta } = require("../db");
const { API_KEY } = process.env;

const createDiets = async () => {
  const allDiets = (
    await axios(
      `https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&number=100&apiKey=${API_KEY}`
    )
  ).data.results;

  const analyzedDiets = []
  allDiets.forEach((diet) => {
    if(diet.vegetarian){
      analyzedDiets.push("vegetarian")
    }
  })

  const allDiet2 =allDiets.map((dieta)=> dieta.diets
  ).toString().split(",")

  const unir = [...analyzedDiets, ...allDiet2]
  const dietsArr = unir.filter((dieta, index) => {
    return dieta !== "" && unir.indexOf(dieta) === index //esta funcion elimina los string son vacioo y si el indice del valor son igual a loq ue me envia por parametro.
  })

  for (const diet of dietsArr) {
    await Dieta.create({
      title: diet
    })
  }

  
};

const getDiets = async() => {
  const allDiet = await Dieta.findAll()
  return allDiet
}

module.exports = {
  createDiets,
  getDiets
};
