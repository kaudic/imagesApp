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

app.use((req, res, next) => {

    // if the full url is http://audicserver.ddns.net:3000/toto
    // "/toto" can be found in req.path or req.originalUrl

    console.log(`req.path: ${req.path}`);
    console.log(`req.subdomains: ${req.subdomains}`);
    console.log(`req.baseUrl: ${req.baseUrl}`);
    console.log(`req.hostname: ${req.hostname}`);
    console.log(`req.originalUrl: ${req.originalUrl}`);
    console.log(`req.path: ${req.path}`);

    next();

});

app.use(router);

module.exports = app;