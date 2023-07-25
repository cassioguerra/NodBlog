const express = require("express");
const router = express.Router();
const Category =require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const { where } = require("sequelize");
const dminAuth = require("../middleware/adminAuth.JS")


router.get("/admin/articles", dminAuth, (req , res)=>{
    Article.findAll({
        include: [Category] //para incluir a categoria
    }).then((articles)=>{
        res.render("admin/articles/index",{articles : articles})
    });
});

router.get("/admin/article/new", dminAuth, (req , res)=>{
    Category.findAll().then(categories  => {
        res.render("admin/articles/new",{categories: categories})  
    });
});

router.post("/articles/save",dminAuth,(req, res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    if (title && body != undefined) {
        Article.create({
            title : title,
            slung: slugify(title),
            body : body,
            categoryId: category
        }).then(()=>{
          res.redirect("/admin/articles");
        })
    }
})

router.post("/article/delete", dminAuth, (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
      if (!isNaN(id)) {
        // for um numero
        Article.destroy({
          where: {
            id: id,
          },
        }).then(() => {
          res.redirect("/admin/articles");
        });
      } else {
        //não for um numero
        res.redirect("/admin/articles");
      }
    } else {
      // se for nulo faz esse redirect
      res.redirect("/admin/articles");
    }
  });

router.get("/admin/articles/edit/:id", dminAuth, (req, res)=>{

  var id = req.params.id;
  Article.findByPk(id).then(article =>{
    if( article !== null ){
      Category.findAll().then(categories =>{
        res.render("admin/articles/edit", {categories: categories, article: article})
      })

    }else{
      res.redirect("/");
    }

  }).catch(error =>{
    res.redirect("/");
  })
})

router.post("/articles/Update", dminAuth,(req, res)=>{
  var id = req.body.id;
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category
  Article.update ({title: title,  body : body,  categoryId: category,  slung: slugify(title)},{
    where:{
      id:id
    }
  }).then(() =>{
    res.redirect("/admin/articles");
  }).catch (err => {
    res.redirect("/");
  });
});

// logica de paginação 
router.get("/articles/page/:num",(req, res) => {
  var page = req.params.num;
  var offset = 0;

  if (isNaN(page) || page == 1) {
    offset =0 ;
  }else{
    // converte para numerico 
    offset = (parseInt(page) -1) * 4;
  }
   // vai pesquisar os elementos do banco de dados e trazer a quantidade 
  Article.findAndCountAll({
     //limit para por limites 
     limit:4, 
     // alterna os resultado 
     offset : offset, 

     order: [
      ["id", "DESC"]
    ]
  }).then(articles => {
// para mostra se tem outra pagina dependo de onde testou 
   var next; 
   
   if(offset + 4 >= articles.count){
     next = false
   }else{
    next = true
   }

   var result ={
    page : parseInt(page),
    next: next,
    articles : articles
   }

   Category.findAll().then(categories=>{
    res.render("admin/articles/page",{result: result, categories: categories});
   })
  
    
  })
  
})



module.exports = router;