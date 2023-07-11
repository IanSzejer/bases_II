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
  port: 5433, // Puerto predeterminado de PostgreSQL
});

const app = express()
const cors = require('cors');
app.use(express.json())
dotenv.config()
app.use(cors());

const PORT = 3000

app.get('/ping', (_req,res) => {
    console.log('someone ping here!')
    res.send('pong!')
})

app.use('/api/pix', router)

app.use("/documentation",swaggerUi.serve, swaggerUi.setup(swaggerSetup))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

