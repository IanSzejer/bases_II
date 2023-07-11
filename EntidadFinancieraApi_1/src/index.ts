import express from "express"
import router from "./routes/controller"
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./docs/swagger";
import * as dotenv from "dotenv";
import { Pool } from 'pg';

// Configura la conexión a la base de datos
export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5434, // Puerto predeterminado de PostgreSQL
});

const app = express()
app.use(express.json())
dotenv.config()

const PORT = 3002

app.get('/ping', (_req,res) => {
    console.log('someone ping here!')
    res.send('pong!')
})

app.use('/', router)

app.use("/documentation",swaggerUi.serve, swaggerUi.setup(swaggerSetup))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

