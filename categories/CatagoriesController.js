const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const dminAuth = require("../middleware/adminAuth.JS")

router.get("/admin/categories/new", dminAuth, (req, res) => {
  res.render("admin/categories/new");
});

router.post("/categories/save", dminAuth, (req, res) => {
  var title = req.body.title;
  const mensagem = req.body.messagem;

  if (title != undefined) {
    Category.create({
      title: title,
      slung: slugify(title),
    }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

// para a tabela
router.get("/admin/categories", dminAuth,(req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/categories/index", { categories: categories });
  });
});

//excluir usar o metodo destroy
router.post("/categories/delete", dminAuth, (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      // for um numero
      Category.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/categories");
      });
    } else {
      //não for um numero
      res.redirect("/admin/categories");
    }
  } else {
    // se for nulo faz esse redirect
    res.redirect("/admin/categories");
  }
});

//editar categoria

router.get("/admin/categories/edit/:id", dminAuth,(req, res) => {
  var id = req.params.id;

  if (isNaN(id)) {
    res.redirect("/admin/categories");
  }

  Category.findByPk(id)
    .then((category) => {
      if (category != undefined) {
        res.render("admin/categories/edit", { category: category });
      } else {
        res.redirect("/admin/categories");
      }
    })
    .catch((erro) => {
      res.redirect("/admin/categories");
    });
});
//desaforma atualiza um dado no sequence
router.post("/categories/update", (req, res) => {
  var id = req.body.id;
  var title = req.body.title;

  Category.update(
    { title: title, slung:slugify(title) }, // o que quer atualizar 
    {
      where: {
        id: id, // onde quer atualizar 
      }
    }).then(()=>{
      res.redirect("/admin/categories");
    })
});


module.exports = router;
