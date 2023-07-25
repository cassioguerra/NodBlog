const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session") // para autenticação 
const connection = require("./database/database");

//controller
const categoriesController = require("./categories/CatagoriesController");
const artidesController = require("./article/ArticlesController");
const userController = require("./user/userController");

//banco
const Article = require("./article/Article");
const Category = require("./categories/Category");
const User = require("./user/User")

//view engine
app.set("view engine", "ejs");

//Sessions 

//Redis um banco aproprido para o salvamento de seção 
//ativar o gerenciamento de sessão obs dessa forma esta sendosalvo em memoria não funciona para medio e grande ports 
app.use(session({
  secret: "qualquercoisa", cookie: { maxAge: 30000 } // maxAge: 30000 esse tempo é em muli segundos nessea caso acada 1 segundo 1000 mulisegundo
}))

//static
app.use(express.static("public"));

//body paeser para trabalha com o formulario no futuro
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//dataBase
connection
  .authenticate()
  .then(() => {
    console.log("conexão ok ");
  })
  .catch((error) => {
    console.log(error);
  });

//rotas

// Rotas passando pela controller
app.use("/", categoriesController);
app.use("/", artidesController);
app.use("/", userController)


//Rotas de sessoes  teste
// app.get("/session", (req, res) =>{
//   req.session.treinamento = "formação node.js"
//   req.session.ano =2023
//   req.session.user={
//     username: "cASSIO GUERRA",
//     email:"guerra@guerra.com",
//     id: 1000
//   }
//   res.send("sessão Gerada")
// });

// app.get("/leitura",(req, res)=>{

//   res.json(
//     {
//       treinamento: req.session.treinamento,
//       ano : req.session.ano,
//       user: req.session.username
//     })
// });



app.get("/sobre", (req, res) => {
  const categories=[]
  res.render("sobre", {categories: categories});
});

app.get("/", (req, res) => {
  Article.findAll({
    order: [
      ["id", "DESC"]
    ],
    limit:4
  }).then(article => {
    Category.findAll().then(categories=> {
      res.render("index", { article: article, categories: categories });
    });
  });
});

app.get("/:slung", (req, res) => {
  var slung = req.params.slung;
  Article.findOne({
    where: {
      slung: slung,
    },
  })
    .then(article => {
      if (article != undefined) {
        Category.findAll().then(categories => {
          res.render("article", { article: article, categories: categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

// app.get("/category/:slung",(req, res) => {
//   var slung = req.params.slung;
//   Category.findOne({
//     where:{
//         slung: slung
//       },
//           include: [{model: Article}] //join
//   }).then( category =>{
//     if(category != undefined){ 
//         category.findAll().then(categories=>{
//             res.render("index",{article: category.article, categories: categories});
//         })

//     }else{
//         res.redirect("/")
//     }
//   }).catch(err =>{
//     res.redirect("/")
//   })
// });


app.get("/category/:slung", (req, res) => {
  var slung = req.params.slung;
  Category.findOne({
    where: {
      slung: slung
    },
    include: [{ model: Article }] // join
  }).then(category => {
    if (category !== null) {
      category.getArticles().then(articles => {
        Category.findAll().then(categories => {
          res.render("index", { article: articles, categories: categories });
        }).catch(err => {
          console.error(err);
          res.render("error_page");
        });
      }).catch(err => {
        console.error(err);
        res.render("error_page");
      });
    } else {
      res.redirect("/");
    }
  }).catch(err => {
    // Handle any errors that occurred during the query for the category
    console.error(err);
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Servido ok ");
});
