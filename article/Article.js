const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category =require("../categories/Category");

const Article = connection.define("article", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slung: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body:{
    type:Sequelize.TEXT,
    allowNull: false
  }
});

Category.hasMany(Article) // 1 para muito hasMany (Tem muitos)
Article.belongsTo(Category); // relacionamiento de 1p1 BelingsTO uma argitgo (pertence a uma) categorias 

//PARA ATUALIZA A TABELA TODA VEZ QUE RODAR O PROGRAMA
// Article.sync({force: true})

module.exports = Article;