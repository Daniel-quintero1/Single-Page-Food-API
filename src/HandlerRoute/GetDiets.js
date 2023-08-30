const {getDiets} = require("../Controllers/ControllersDiets")


const newDiet = async (req, res) => {

    try {
      res.json(await getDiets());
    } catch (error) {
      res.status(404).send(error.message);
    }
  };

module.exports = {
  newDiet,
};
