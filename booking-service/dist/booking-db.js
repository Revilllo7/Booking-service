"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: 'postgres', // nazwa użytkownika bazy danych
    host: 'booking-db', // nazwa usługi z docker-compose
    database: 'bookingdb',
    password: 'postgres',
    port: 5432,
});
