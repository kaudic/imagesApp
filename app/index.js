const express = require('express');
const cors = require('cors');
const router = require('./router');
const app = express();

// first middlewares

app.use(cors());
app.set('views', `${process.cwd()}/app/views`);
app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

module.exports = app;