import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Decode the certificate by replacing the `\n` with actual newlines
const sslCert = process.env.DB_SSL_CERT ? process.env.DB_SSL_CERT.replace(/\\n/g, '\n') : null;

if (!sslCert) {
    console.error('DB_SSL_CERT environment variable is not set');
    process.exit(1); // Exit the application with an error code
}

const db = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: sslCert,
        // ca: fs.readFileSync("./ca.pem").toString(),
    },
});

export default db;
