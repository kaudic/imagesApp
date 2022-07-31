const express = require('express');
const cors = require('cors');
const router = require('./routes');
const app = express();

//
app.use((req, res, next) => {
    console.log('request reçue dans index: ' + req.url);
    console.log(JSON.stringify(req.headers));
    next();
});

// Dynamic Cors
const allowlist = ['http://audicserver.ddns.net:3000/imagesApp', 'http://localhost:3000'];

var corsOptionsDelegate = function (req, callback) {

    const corsOptions = {
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'UPDATE'],
        credentials: true,
    };

    console.log('Origin: ' + req.header('Origin'));

    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions.origin = true;
    } else {
        corsOptions.origin = false;
    };
    callback(null, corsOptions)
};

app.use(
    cors(corsOptionsDelegate),
);

// first middlewares
app.set('views', `${process.cwd()}/app/views`);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

module.exports = app;