import express, { NextFunction, Request, Response } from "express"
import router from "./routes/controller"
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./docs/swagger";
import * as dotenv from "dotenv";
import { Pool } from 'pg';
import { DBUserAuth } from "./services/postgre";
import auth from "basic-auth"

function myAuthorizer(req:Request,res:Response, next: NextFunction) {
  // Access the request parameters (userId and key_type)
  const { userId } = req.params;

  // Use basic-auth package to parse the Authorization header and get the username and password
  const credentials = auth(req);

  if (!credentials || !credentials.name || !credentials.pass) {
    // No credentials provided or incomplete credentials
    res.status(401).send('Authentication failed. Please provide valid credentials.');
    return;
  }
  DBUserAuth(credentials.name,credentials.pass,userId,res,next)
  return
}

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

app.use('/payment/user/:userId/:key_type', myAuthorizer );
app.use('/user/:userId/associate/:key_type', myAuthorizer);
app.use('/user/:userId/:key_type/history', myAuthorizer);
app.use('/user/:userId/history', myAuthorizer);
app.use('/user/:userId/:key_type/balance', myAuthorizer);
app.use('/', router)

app.use('/', router)

app.use("/documentation",swaggerUi.serve, swaggerUi.setup(swaggerSetup))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


