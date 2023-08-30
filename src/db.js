require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;


const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/food`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// RecipeModel(sequelize);
// DietsModel(sequelize);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Recipe, Dieta } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);  RELACION DE UNO A MUCHOS
Recipe.belongsToMany(Dieta, { through: 'Recipe_Diet' });
Dieta.belongsToMany(Recipe, { through: 'Recipe_Diet' });
//food=# INSERT INTO "Recipe_Diet" ("createdAt", "updatedAt", "RecipeId", "DietId") 
//VALUES (NOW(), NOW(), '98fe3a92-e315-4f3a-84d7-c336f980a570', '95a8f94a-4f5c-4f87-9ee1-77e87582facc');
//                                         ||                                    ||   
//                       modelo         id-Recipes                   model     id-Diets   

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize // para importart la conexión { conn } = require('./db.js');
};
/**
 * En este ejemplo, hemos agregado una columna dietId en la tabla recipes
 *  que se usará como clave foránea para
 *  hacer referencia a la tabla diets. Luego, hemos definido 
 * la relación de uno a muchos entre Recipe y Diet usando 
 * los métodos belongsTo y hasMany.

Ahora puedes usar la relación de la siguiente manera:

Para agregar una dieta a una receta, 
puedes simplemente crear una receta y establecer
 el valor de la propiedad dietId 
a la ID de la dieta correspondiente:

const recipe = await Recipe.create({
  nombre: 'Ensalada de frutas',
  image: 'https://example.com/ensalada.jpg',
  resumen_del_plato: 'Una deliciosa ensalada de frutas frescas.',
  nivel_de_comida_saludable: 0.9,

  paso_a_paso: '1. Corta las frutas en pedazos pequeños. 2. Mezcla todas las frutas en un tazón. 3. Sirve frío.',
  dietId: 1 // La ID de la dieta correspondiente
});
Para obtener las recetas asociadas a una dieta, puedes
usar el método getRecipes proporcionado por el modelo Diet:

javascript
Copy code
const diet = await Diet.findByPk(1); // Obtener la dieta correspondiente
const recipes = await diet.getRecipes(); // Obtener las recetas asociadas





 */
