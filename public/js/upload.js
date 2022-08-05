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
        socket: '',
        filesCount: 0, // number of files to treat - for loading bar
        filesIndex: 0  // index of the file being treated - for loading bar
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
            upload.properties.filesIndex += 1;
            upload.updateLoadingBar();
            upload.updateMessage(message);
        });

        socket.on('uploadLength', (filesCount) => {
            upload.properties.filesCount = filesCount;
        });

        return socket;
    },
    addListennersToAction: () => {
        const upLoadBtn = document.getElementById('upLoadBtn');
        upLoadBtn.addEventListener('click', upload.sendPictures);
    },
    updateLoadingBar: () => {
        const percentOfTransfer = Math.round((upload.properties.filesIndex / upload.properties.filesCount) * 100);

        const loaderElement = document.querySelector('.loader');
        const loadingBarWidth = document.querySelector('.loadingBar').offsetWidth;

        // Check that we don't go over 100%
        if (percentOfTransfer > 100) {
            loaderElement.textContent = '100%';
            loaderElement.style.width = loadingBarWidth;
        } else {
            loaderElement.style.width = (loadingBarWidth * (percentOfTransfer / 100)) + 'px';
            loaderElement.textContent = percentOfTransfer + '%';
        }
    },
    updateMessage: (message) => {
        const loadingMessageElement = document.querySelector('.loadingMessage');
        loadingMessageElement.textContent = message;
    },
    sendPictures: async (e) => {
        e.preventDefault();
        const formDetails = document.querySelector('form');
        const formData = new FormData(formDetails);

        // Display a loader - with loading bar and details from socket
        const loaderDiv = document.getElementById('loaderInfo');
        loaderDiv.classList.remove('hidden');

        await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'authorization': upload.properties.token
            }
        });

        // Hide loader
        loaderDiv.classList.add('hidden');

        // Rest loader style
        document.querySelector('.loadingMessage').textContent = '';
        document.querySelector('.loader').style.width = 0 + 'px';

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