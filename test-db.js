import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { parse } from 'url';

dotenv.config();

const dbUrl = process.env.MYSQL_PUBLIC_URL;
const parsed = parse(dbUrl);

// Extraer datos
const [user, password] = parsed.auth.split(':');
const host = parsed.hostname;
const port = parsed.port;
const database = parsed.pathname.replace('/', ''); // quitar la barra inicial

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
            database,
        });

        console.log('✅ ¡Conectado a MySQL con MYSQL_PUBLIC_URL!');
        const [rows] = await connection.query('SELECT NOW() AS now');
        console.log('Hora desde la DB:', rows[0].now);

        await connection.end();
    } catch (err) {
        console.error('❌ Error al conectar con MySQL:');
        console.error(err);
    }
}

testConnection();
