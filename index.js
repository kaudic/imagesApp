// importation des différents package
const http = require('http');
require('dotenv').config();
const app = require('./app');
const port = process.env.PORT ?? 3000;
const server = http.createServer(app);

// launch the different other projects using child process
// launch a shell command to start images App

// app listenning to port
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});