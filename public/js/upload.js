const upload = {
    init: async () => {
        console.log('init script launched');
        upload.addListennersToAction();

        // get the token and if any
        const token = window.localStorage.getItem('audicServerToken');

    },
    addListennersToAction: () => {

    },

};

document.addEventListener('DOMContentLoaded', upload.init);