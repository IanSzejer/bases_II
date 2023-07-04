import express from "express"
import controller from "./routes/controller"

const app = express()
app.use(express.json())

const PORT = 3000

app.get('/ping', (_req,res) => {
    console.log('someone ping here!')
    res.send('pong!')
})

app.use('/api/pix', controller)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})