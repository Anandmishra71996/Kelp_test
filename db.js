require('dotenv').config();

const pgp = require('pg-promise')();
console.log(process.env.DB_NAME)
const connectionParams = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432
};

const db = pgp(connectionParams)
module.exports={db,pgp}