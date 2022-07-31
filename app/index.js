const express = require('express');
const cors = require('cors');
const router = require('./routes');
const app = express();
const path = require('path');

// first middlewares

app.use(cors());
app.set('views', `${process.cwd()}/app/views`);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

module.exports = app;