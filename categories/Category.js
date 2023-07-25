const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define("categories", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slung: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

//PARA ATUALIZA A TABELA TODA VEZ QUE RODAR O PROGRAMA 
// Category.sync({force: true})

module.exports = Category