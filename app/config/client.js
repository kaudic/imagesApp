// const debug = require('debug')('SQL:log');
const { Pool } = require('pg');

const config = {
    // connectionString: process.env.DATABASE_URL
    connectionString: 'postgresql://spedata:spedata@localhost/imageapp'
};

// si j'exécute l'appli sur Héroku, je complète mon object de config
if (process.env.NODE_ENV === 'production') {
    // ici, on désactive l'obligation pour notre app node de se
    // connecter à la BDD en ssl (mode sécurisé)
    config.ssl = {
        // true would be better but needs to get the SSL certificate (which will be possible if I buy one)
        rejectUnauthorized: false,
    };
}

const pool = new Pool(config);

module.exports = {
    // On expose quand même le client original "au cas ou"
    originalClient: pool,

    async query(...params) {
        // if (process.env.NODE_ENV !== 'production') {
        //     // if not in production we want to console log the SQL request.
        //     // if in prod, we don't want as it slows down process for example when editing a blog article
        //     debug(...params);
        // }
        // console.log(...params);

        return this.originalClient.query(...params);
    },
};
