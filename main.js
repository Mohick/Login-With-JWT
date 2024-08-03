
// configuration
require('dotenv').config()
const express = require('express')
const app = express()
// config cors middleware
const configCORS = require('./src/Config/CORS/CORS')
configCORS(app)
var cookieParser = require('cookie-parser')
const mainController = require("./src/MVC/Controller/Main Controll")
const runReadJson = require('./src/Config/JSON/Json.js')
const configMorgan = require('./src/Config/Morgan/Morgan')
const connectMongoDB = require('./src/Config/Connect  MongoDB/Connect Mongoose')
const port = process.env.EXPRESS__PORT || 3000
app.use(cookieParser())
// config session-cookies middle

//config morgan 
configMorgan(app)
// config views s
// config watch types files json 
runReadJson(app, express)
// connect mongoDB
connectMongoDB()


//controll routes 

mainController(app)

// port of express
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})