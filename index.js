// importation des différents package
const http = require('http');
require('dotenv').config();
const app = require('./app');
const port = process.env.PORT ?? 3000;
const server = http.createServer(app);
const io = require('socket.io')(server);
const imageDatamapper = require('./app/models/image');

io.on('connection', (socket) => {
    console.log(`Nouveau client connecté à ImagesApp avec le socket id:  ${socket.id}`);

    socket.emit('welcome', socket.id);

    socket.on('disconnect', () => {
        imageDatamapper.deleteImageBeingTagguedBySocket(socket.id);
    })
    socket.on('error', () => {
        console.log('une erreur est survenue, suppression du socket dans table tag_socket');
        imageDatamapper.deleteImageBeingTagguedBySocket(socket.id);
        console.log('on émet une information au client pour qu\'il prenne un nouveau socket');
        socket.emit('askForNewSocket', 'une erreur est survenue avec le socket, il faut reprendre un nouveau socket');
        socket.disconnect(true);

    })

});

// app listenning to port
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});