
const path = require('path');

const express = require('express');
const app = express();
const sequelize = require ('./util/database');

const cors = require("cors");
const Users = require ('./models/user');

const userRoutes = require('./routes/user');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cors());

app.use('/user', userRoutes);



app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>');
});
const port = 3000;


sequelize
.sync()
.then((result) => {
    console.log(`server is working on http://localhost:${port}`);
   app.listen(port);
}).catch((err) => {
    console.log(err)
});
