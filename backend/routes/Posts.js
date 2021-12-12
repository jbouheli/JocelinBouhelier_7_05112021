const express = require('express');
const router = express.Router();

const { Posts, Likes,Comments,Users } = require("../models");

const { validateToken } = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");


// recuperer tous les posts non signaller
router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ 
    attributes:['id','content','picture','usersLikes','createdAt'],
    include: [
      {
        model: Users,
        as:'author',
        attributes: ['id','username','profile_picture']
      },
      {
          model: Comments,
          as: 'comments',
          attributes: ['id','content',"user_id","createdAt"],
          order:[
            ['createdAt','DESC']
          ],
          include:[
            {
              model: Users,
              as:'author',
              attributes: ['id','username','profile_picture']
            }
          ]
      }
    ],
    order:[
      ['createdAt','DESC']
    ],

  });  //function qui go through the tables and generate the sql
  
  res.json({ posts: listOfPosts});
});



// recuperer tous les posts signaler
router.get("/reported", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ 
    attributes:['id','content','picture','usersLikes','createdAt'],
    include: [
      {
        model: Users,
        as:'author',
        attributes: ['id','username','profile_picture']
      },
      {
          model: Comments,
          as: 'comments',
          attributes: ['id','content',"user_id","createdAt"],
          order:[
            ['createdAt','DESC']
          ],
          include:[
            {
              model: Users,
              as:'author',
              attributes: ['id','username','profile_picture']
            }
          ]
      }
    ],
    where:{postNotice:true},
    order:[
      ['createdAt','DESC']
    ],

  });  //function qui go through the tables and generate the sql
  
  res.json({ posts: listOfPosts});
});


// recherche d'un post
router.get('/byId/:id', async (req, res) => {
   const postId = req.params.id 
   const post = await Posts.findOne({
    where:{id:postId},
    include: [
      {
        model: Users,
        as:'author',
        attributes: ['id','username','profile_picture']
      },
      {
          model: Comments,
          as: 'comments',
          attributes: ['id','content',"user_id"],
          order:[
            ['createdAt','ASC']
          ],
          include:[
            {
              model: Users,
              as:'author',
              attributes: ['id','username','profile_picture']
            }
          ]
      }

    ] 
   })  //(findByPk)=Pour dire a sequelize qu'on veut select un item specific, Pk=Primary key qu'on le trouve dans MySQL Table qu'on a créé
   res.json(post);
});  

// recherche des posts d'un utilisateur
router.get('/byuserId/:id', async (req, res) => {
  const id = req.params.id 
  const listOfPosts = await Posts.findAll({ 
    where: {user_id: id },
    include: [
      {
        model: Users,
        as:'author',
        attributes: ['id','username','profile_picture']
      },
      {
          model: Comments,
          as: 'comments',
          attributes: ['id','content',"user_id"],
          include:[
            {
              model: Users,
              as:'author',
              attributes: ['id','username','profile_picture']
            }
          ]
      },
    ],
    order:[
      ['createdAt','DESC']
    ],
  });
  res.json({posts:listOfPosts});
}); 

// creation d'un post
router.post("/", [validateToken,multer], async (req, res) => { //on met async/await pour etre sure que c'est entrer dans le database
    const post = req.body;
    let initial_likes = JSON.stringify([]) ; // on initialie le tableau vide
    post.user_id = req.user.id;
    post.picture = `images/${req.file.filename}`;
    post.usersLikes = initial_likes ;
    try{
      let post_save = await Posts.create(post);
      // je renvoie le post integrale avec les dependances
      const postDetail = await Posts.findByPk(post_save.id,{
        include: [
          {
            model: Users,
            as:'author',
            attributes: ['id','username','profile_picture']
          },
          {
              model: Comments,
              as: 'comments',
              attributes: ['id','content',"user_id"],
              include:[
                {
                  model: Users,
                  as:'author',
                  attributes: ['id','username','profile_picture']
                }
              ]
          }
    
        ] 
      })  //(findByPk)=Pour dire a sequelize qu'on veut select un item specific, Pk=Primary key qu'on le trouve dans MySQL Table qu'on a créé
      res.status(201).json({message:"post publier avec succes",post:postDetail});
    }catch(error){
      console.log(error)
      res.status(500).json({message:"use erreur est survenue essayez plus tard"})
    }
}); 

// supprimer un post
router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json({message:"post supprimer avec succes"});
});

// reporter un post
router.get("/report/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.update( {postNotice: true}, {where: { id: postId},});
  res.json({message:"post reporter avec succes"});
});


// like un post 
router.post("/like/:postId",validateToken, async (req,res)=>{
  // recuperer le post
  let postId = req.params.postId
  let opt = req.body.option
  let userId = req.user.id ;
  Posts.findOne({
      where: { id: postId }
  })    
  .then(post => {
      if(post) {
          if (opt == 1) { 
              let likes = JSON.parse(post.usersLikes)
              if(!likes.includes(userId)) {
                   // si l'utilisateur pas encore liké    
                   likes.push(userId) ;
                   likes =  JSON.stringify(likes) ;
              }
              post.update({usersLikes:likes})
              return res.status(200).json({ message: 'j\'aime',userId:userId,postId:postId});
          }                                 
          else if (opt == -1 ) {
              let likes = JSON.parse(post.usersLikes)
              if(likes.includes(userId)) {
                  // si l'utilisateur a deja liké , on supprime    
                  likes = likes.filter(item => item !=userId) ;
                  likes = JSON.stringify(likes) ;
              }
              post.update({ usersLikes:likes })
              return res.status(200).json({ message: 'pas de préférence', userId:userId,postId:postId});                     
          } 
      } else {
          res.status(404).json({message:"pas de post"})
      }
      
  })
  .catch(error => {
      console.log(error)
      res.status(500).json({ message: "une erreur est survenue , essayez plus tard" });
  });   
})



module.exports = router;