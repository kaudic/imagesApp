const express = require('express');
const cors = require('cors');
const router = require('./routes');
const app = express();

// first middlewares

app.use(cors());
app.set('views', `${process.cwd()}/app/views`);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log('request reçue dans index: ' + req.url);
    next();
})

app.use(router);

module.exports = app;