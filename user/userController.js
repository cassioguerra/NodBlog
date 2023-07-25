const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs")
const dminAuth = require("../middleware/adminAuth.JS")



router.get("/admin/users", dminAuth,(req , res)=>{
   User.findAll().then((users)=>{
    res.render("admin/users/index", {users: users})
   });
});

router.get("/admin/users/create", dminAuth,( req, res)=>{
    res.render("admin/users/create")
});

router.post("/users/create", dminAuth,( req, res)=>{
 
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where:{email :email}}).then(user =>{

        if (user == null) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email:email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch((err) => {
                res.redirect("/")
            });
        
        }else{
            res.redirect("/admin/articles");
        }
    });
    //teste para ver se esta passando 
    // res.json({email, password})
});

// login

router.get("/login", (req, res)=>{
res.render("admin/users/login")
})

router.post("/authenticate",(req, res)=>{

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where:{email: email}
    }).then(user=>{
        if (user != undefined) { // se exite um usuario com esse email 
            // validar senha 
            var correct = bcrypt.compareSync(password,user.password)

            if (correct) {
                // iniciar sessão para todos que estão logado 
                req.session.user ={
                    id : user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            } else {
                res.redirect("/login");
            }
        }else{
            res.redirect("/login");
        }
    })
})


router.get("/logout" ,(req, res)=>{
    req.session.user = undefined;
    res.redirect("/home")
})

module.exports = router;
