const express = require('express');
const app = express();
const sequelize = require ('./util/database');

const cors = require("cors");
const Users = require ('./models/user');

const userRoutes = require('./routes/user');
app.use(express.json()); // For parsing application/json

app.use(express.urlencoded({ extended: true }));
app.use('/user', userRoutes);

const port = 3000;

Users.sync();
sequelize
.sync()
.then((result) => {
    console.log(`server is working on http://localhost:${port}`);
   app.listen(port);
}).catch((err) => {
    console.log(err)
});