import express, { json } from 'express' // require --> commonJS
import cors from 'cors'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config'
import { PUERTO } from './config.js'

export const createApp = ({ movieModel }) => {
    // el import del futuro
    //import movies from './movies.json' with {type: 'json'}

    // como leer un json en ESModules
    //import fs from 'node:fs'
    //const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

    //const movies = readJSON('./movies.json')

    const app = express()
    app.use(json())
    app.use(corsMiddleware())
    app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

    // metodos normales: GET/HEAD/POST
    // metodos complejos: PUT/PATCH/DELETE

    // CORS PRE-Flight
    // OPTIONS

    app.use('/movies', createMovieRouter({ movieModel }))

    const PORT = process.env.PORT || PUERTO

    app.listen(PORT, () => {
        console.log(`server listening on port http://localhost:${PORT}`)
    })

}
