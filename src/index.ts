import express from "express"
import router from "./routes/controller"
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./docs/swagger";


const app = express()
app.use(express.json())

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