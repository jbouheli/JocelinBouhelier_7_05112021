const express = require("express");
const router = express.Router();
const { Comments,Users } = require("../models");
const { validateToken } = require('../middlewares/auth');

//Pour récupérer le postId
router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

//Pour créer les comments
router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  // console.log(comment) ;
  comment.user_id = req.user.id;
  saving = await Comments.create(comment);
  comment_save = await Comments.findByPk(saving.id,{
    include:[
      {
        model: Users,
        as:'author',
        attributes: ['id','username','profile_picture']
      }
    ]
  })
  res.status(201).json({message:"commentaire poster", comment:comment_save});
});

//Pour supprimer un commentaire
router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  try{
    comment_destroy = await Comments.destroy({
      where: {
        id: commentId,
      },
    });
    // console.log(comment_destroy)
    res.json({message:"commentaire supprimer",comment:comment_destroy});
  }catch(error){
    console.log(error)
    res.status(500).json({ message: "une erreur est survenue , essayez plus tard" });
  }
});


module.exports = router;