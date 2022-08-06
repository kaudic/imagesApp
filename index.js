// importation des différents package
const http = require('http');
require('dotenv').config();
const app = require('./app');
const port = process.env.PORT ?? 3000;
const server = http.createServer(app);
const imageDatamapper = require('./app/models/image');

// initialize your local socket.io module - I have put a file in config folder
const sio = require('./app/config/socketio');
const io = sio.init(server);

io.on('connection', (socket) => {
    console.log(`Nouveau client connecté à ImagesApp avec le socket id:  ${socket.id}`);

    // In case we have sockets registerd at this point, we will delete them to restart fresh
    if (Object.keys(socket.server.eio.clients).length === 1) {
        console.log('Emptying Table tag_socket before starting');
        imageDatamapper.deleteAllBeingTaggued();
    }
    // Register it in locals to get access to socket in the controllers
    app.locals.socket = socket;

    socket.emit('welcome', socket.id);

    socket.on('disconnect', () => {
        imageDatamapper.deleteImageBeingTagguedBySocket(socket.id);
    });

    socket.on('error', () => {
        console.log('une erreur est survenue, suppression du socket dans table tag_socket');
        imageDatamapper.deleteImageBeingTagguedBySocket(socket.id);
        console.log('on émet une information au client pour qu\'il prenne un nouveau socket');
        socket.emit('askForNewSocket', 'une erreur est survenue avec le socket, il faut reprendre un nouveau socket');
        socket.disconnect(true);
    });

});

// app listenning to port
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});