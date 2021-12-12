module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users,{
      onDelete:"cascade",
      foreignKey:"user_id",
      as:"author"
    }) ;
  } ;
  
  return Comments;
};