const upload = {
    init: async () => {
        console.log('init script launched');
        upload.addListennersToAction();

        // get the token and if any
        const token = window.localStorage.getItem('audicServerToken');
        if (token) {
            upload.properties.token = token;
            console.log('token: ' + upload.properties.token);
        }
    },
    properties: {
        token: ''
    },
    addListennersToAction: () => {
        const upLoadBtn = document.getElementById('upLoadBtn');
        upLoadBtn.addEventListener('click', upload.sendPictures);
    },
    sendPictures: (e) => {
        e.preventDefault();
        const formDetails = document.querySelector('form');
        const formData = new FormData(formDetails);
        fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'authorization': upload.properties.token
            }
        });

        // if checkbox about tag is chcecked then redirect to tag page
        const checkedElement = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
        const checkedId = [];
        checkedElement.forEach(element => checkedId.push(element.id));
        if (checkedId.indexOf('checkboxTag') !== -1) {
            window.location.href = '/tags';
        }

    }
};

document.addEventListener('DOMContentLoaded', upload.init);