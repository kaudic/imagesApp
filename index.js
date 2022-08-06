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

    // Register it in locals to get access to socket in the controllers
    app.locals.socket = socket;

    socket.emit('welcome', socket.id);

    socket.on('disconnect', () => {
        imageDatamapper.deleteImageBeingTagguedBySocket(socket.id);
        // Check if there is no more client - if no more client, then empty table tag_socket
        if (io.sockets.sockets.length === 0) {
            console.log('no more sockets connected - emptying table');
            imageDatamapper.deleteAllBeingTaggued();
        }
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