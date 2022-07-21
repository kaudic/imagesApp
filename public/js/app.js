const app = {
    init: async () => {
        console.log('init script launched');
        app.addListennersToAction();

        // get the token and if any
        const token = window.localStorage.getItem('audicServerToken');

    },
    addListennersToAction: () => {

    },

};

document.addEventListener('DOMContentLoaded', app.init);