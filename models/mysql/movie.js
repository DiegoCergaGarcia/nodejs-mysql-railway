import mysql from 'mysql2/promise'
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../../config.js'
import { parse } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.MYSQL_PUBLIC_URL;
const parsed = parse(dbUrl);

// Extraer datos
const [user, password] = parsed.auth.split(':');
const host = parsed.hostname;
const port = parsed.port;
const database = parsed.pathname.replace('/', ''); // quitar la barra inicial

const URL_CONFIG = {
    host: host,
    port: port,
    user: user,
    password: password,
    database: database
}

const DEFAULT_CONFIG = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
}

const connectionString = URL_CONFIG ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
    static async getAll({ genre }) {
        const [movies] = await connection.query(
            'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie;'
        )

        return movies
    }

    static async getById({ id }) {
        const [movies] = await connection.query(
            'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);', [id]
        )

        if (movies.length === 0) return null

        return movies[0]
    }

    static async create({ input }) {
        const {
            genre: genreInput,
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input

        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult

        try {
            await connection.query(
                `INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`, [title, year, director, duration, poster, rate]
            )
        } catch (error) {
            throw new Error('Error creating movie')
        }

        const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);`, [uuid]
        )

        return movies[0]
    }

    static async delete({ id }) {

    }

    static async update({ id, input }) {

    }

}