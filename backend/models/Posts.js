module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      picture:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      // contient l'id des utilisateurs qui like
      usersLikes: {
        type: DataTypes.STRING,
        allowNull: false 
      },
      // permet la moderation communication
      postNotice:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false 
      },
  });
  
  //Pour faire la liaison entre les posts et les comments
  Posts.associate = (models) => {
      //Pour faire la liaison entre les posts et les Users
      Posts.belongsTo(models.Users,{
        onDelete:"cascade",
        foreignKey:"user_id",
        as:"author"
      }) ;
      Posts.hasMany(models.Comments, {
        onDelete: "cascade",  //Si je supprime un post les comments aussi seront supprimer
        foreignKey:"post_id",
        as:"comments"
      });
    };

  return Posts;
};
  