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

});

// app listenning to port
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});