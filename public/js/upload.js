const upload = {
    init: async () => {
        console.log('init script launched');
        upload.addListennersToAction();

        // Init the socket for the upload page
        const socket = upload.initSocket();

        // in case of a problem with the socket then we will receive an event from the server
        socket.on('askForNewSocket', (message) => {
            console.log(message);
            upload.initSocket();
        });

        socket.on('error', (message) => {
            console.log(message);
            upload.initSocket();
        });

    },
    properties: {
        socket: ''
    },
    initSocket: () => {
        // Register socket in upload properties
        let ioServerPath = BASE_URL;
        let socket;
        ioServerPath = BASE_URL.replace('/imagesApp', '');

        if (ioServerPath.includes('audicserver')) {
            socket = io(ioServerPath, { path: '/imagesApp/socket.io/' });
        } else {
            socket = io(ioServerPath);
        }

        socket.on('welcome', (socketId) => {
            console.log('socketId: ' + socketId);
            upload.properties.socket = socketId
        });

        socket.on('upload', (message) => {
            console.log('message du serveur: ' + message);
        });

        socket.on('uploadLength', (message) => {
            console.log('nombre de fichiers: ' + message);
        });

        return socket;
    },
    addListennersToAction: () => {
        const upLoadBtn = document.getElementById('upLoadBtn');
        upLoadBtn.addEventListener('click', upload.sendPictures);
    },
    sendPictures: async (e) => {
        e.preventDefault();
        const formDetails = document.querySelector('form');
        const formData = new FormData(formDetails);

        // Display a loader - with loading bar and details from socket

        await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'authorization': upload.properties.token
            }
        });

        // Hide loader



        // if checkbox about tag is chcecked then redirect to tag page
        const checkedElement = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
        const checkedId = [];
        checkedElement.forEach(element => checkedId.push(element.id));
        if (checkedId.indexOf('checkboxTag') !== -1) {
            window.location.href = `${BASE_URL}/tags`;
        }

    }
};

document.addEventListener('DOMContentLoaded', upload.init);