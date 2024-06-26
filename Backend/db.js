const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ppo3',
    password: '123',
    port: 5432,
});

module.exports = pool;
