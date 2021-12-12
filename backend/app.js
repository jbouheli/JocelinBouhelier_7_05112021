require('dotenv').config()

const express = require('express');
const app = express();

const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const db = require('./models');


//Routers
const postRouter = require('./routes/Posts');
const commentsRouter = require('./routes/Comments');
const usersRouter = require('./routes/Users');

//Connection à la base de données
db.sequelize
    .authenticate()
    .then(() => {
        console.log('connexion à la base de données');
        db.sequelize.sync({
            /* force:true */
        })
    })
    .catch(error => {
        console.log(error);
    });


//middleware permettant d'accéder à l'API depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(cors());

//middleware qui aide à sécuriser l'API en définissant divers en-têtes HTTP
app.use(helmet());


  
  
  
app.use("/posts", postRouter);
app.use("/comments", commentsRouter);
app.use("/auth", usersRouter);

module.exports = app;





















