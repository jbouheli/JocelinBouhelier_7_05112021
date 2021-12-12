const _ = require('lodash');


const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/auth");

const { sign } = require("jsonwebtoken"); //pour generer le TOKEN
const multer = require('../middlewares/multer-config');

//SIGNUP //Inserer les éléments dans le table Users pour faire l'inscription
router.post("/register", async (req, res) => {
  let errors ={} ;
  const { username, password, email } = req.body;
  // validate email , username and password can't be null
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // validation enmail
  if (!emailRegex.test(String(email).toLowerCase())){
    errors.email = "email pas valide"
  }
  //  username doit pas etre null
  if (!username || username.trim() === ''){
    errors.username = "username est requis"
  }
  // password doit pas etre null
  if (!password || password.trim() === ''){
    errors.password = "password est requis"
  }

  // on verifie que l'email n'est pas encore utilise
  const user = await Users.findOne({ where: { email: email } });
  if(user){
    errors.email = "email deja utiliser"
  }

  // est je les erreurs ? si oui je peu pas continue
  if (!_.isEmpty(errors)) {
    return  res.status(400).json({ message:"une erreur est survenue", errors:errors  });
  }

  try{
    let hash = await bcrypt.hash(password, 10) ;
    await Users.create({username: username,password: hash,email: email,});
    res.status(201).json({message:"creation compte reuissi , connectez vous des maintenant"});
    
  }catch(error){
    console.log(error)
    res.status(500).json({ message: "une erreur est survenue , essayez plus tard" });
  }
});


//LOGIN
router.post("/login", async (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body;

  const user = await Users.findOne({ where: { email: email } });

  if (!user) res.status(400).json({ error: "email ou mot passe incorrect" });

  try{
    let match = await bcrypt.compare(password, user.password) ;
    console.log(match)
    if (match){
      
      const accessToken =  sign(
        { username: user.username, id: user.id, email: user.email,profile_picture:user.profile_picture },
        process.env.JWT_SECRET
      );
      res.json({token: accessToken,username: user.username,id: user.id,email: user.email,profile_picture:user.profile_picture,description:user.description,isAdmin:user.isAdmin}); 
    } 

    res.status(400).json({ error: "email ou mot passe incorrect" });

  }catch(error){
    console.log(error)
    res.status(500).json({ message: "une erreur est survenue , essayez plus tard" });
  }
  
  
});

//Chaque fois qu'on fait cette requete on recupére des infos pour le user
router.get("/", validateToken, async (req, res) => {
  const userInfo = await Users.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },  //J'exclue le password par les info que je veux recevoir
  });
  res.json(userInfo);
});


//Pour recuperer les infos du profile
router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;
  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },  //J'exclue le password par les info que je veux recevoir
  });

  res.json({user:basicInfo});
});

//Pour changer le mot de passe 
router.put('/changepassword', validateToken, async (req, res) => { 
  const {oldPassword, newPassword} = req.body;
  const user = await Users.findByPk(req.user.id);

  //On compare l'ancien password avec le table dans la Table de Base de donneés
  try{
    let match = await bcrypt.compare(oldPassword, user.password) ;
    if (match){
      let hash = await bcrypt.hash(newPassword, 10) ;
      await Users.update({password: hash}, { where: { id: req.user.id } }) ;
      return res.json({message:"mot passe changer avec succes "});
    }
    res.status(400).json({ message: "mot passe pas correct , veuillez renseignez votre anccien mot de passe" });
  }catch(error){
    console.log(error)
    res.status(500).json({ message: "une erreur est survenue , essayez plus tard" });
  }

});


router.post('/upload-picture',[validateToken,multer], async (req,res)=>{
   console.log(req.user) ;
   let picture =  `images/${req.file.filename}`;
   try{
      await Users.update({profile_picture:picture},{
        where: {id:req.user.id}
      }) ; 
      res.json({message:"profil mise a jour", profile_picture:picture}); 
   }catch(error){
     console.log(error) ; 
     res.status(500).json({ message: "une erreur est survenue , essayez plus tard" });
   }

})

router.put("/update-description", validateToken, async (req, res) => { 
  const { description } = req.body;
  await Users.update({description}, {where: { id: req.user.id }}) ;    
  res.json({message:"mise a jour effectuer"});
});


// supprimer un post
router.delete("/user", validateToken, async (req, res) => {
  const userId = req.user.id;
  await Users.destroy({
    where: {
      id: userId,
    },
  });

  res.json({message:"compte supprimer avec succes"});
});


module.exports = router;