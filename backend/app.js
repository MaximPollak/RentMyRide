const express = require('express')
const app = express()
const port = 3000;

require('dotenv').config()

//connecting database
const db = require("./services/database.js")

app.use(express.json())

const indexRouter = require('./routes/index')
const carRoutes = require('./routes/cars')
const userRoutes = require('./routes/users')

const cors = require('cors')
app.use(cors())

app.use('/', indexRouter)
app.use('/cars', carRoutes)
app.use('/users', userRoutes)

// Routes would go here later


app.listen(port, () => {
    console.log(`Example app listening at http://127.0.0.1:${port}`);
});