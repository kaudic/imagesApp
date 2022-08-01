const express = require('express');
const cors = require('cors');
const router = require('./routes');
const app = express();

// Dynamic Cors
const allowlist = ['http://audicserver.ddns.net:3000', 'http://localhost:4000', 'http://localhost:3000'];

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

app.use((req, res, next) => {
    console.log('request reçue dans index: ' + req.url);
    console.log('Content-Type: ' + req.header('Content-Type'));
    if (req.body) {
        console.log('body présent: year: ' + req.body.year);
    } else {
        (console.log('pas de body'));
    }

    next();
});

// first middlewares
app.set('views', `${process.cwd()}/app/views`);
app.set('view engine', 'ejs');

app.use(router);

module.exports = app;