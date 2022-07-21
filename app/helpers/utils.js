const jwt = require('jsonwebtoken');

const utils = {

    readCredentials: () => {

    },

    generateToken: (user) => {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
    }
};

module.exports = utils;