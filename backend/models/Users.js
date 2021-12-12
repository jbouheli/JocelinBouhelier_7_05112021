module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true // email doit etre unique
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:null
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
      default:null
    },
    isAdmin:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false 
    },
  });

//On associe les users avec les likes et les Posts
  Users.associate = (models) => {
    
    Users.hasMany(models.Posts, {
      onDelete: "cascade",
      as: "posts"
    });
  };

  return Users;
};