const dotenv = require('dotenv')
const express = require('express')
const mongoose = require("mongoose")
const helmet = require('helmet')
const morgan  = require('morgan')
const app = express()
const userRoute = require("./routes/users")

dotenv.config()

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true},console.log("connected to mongo"));

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use("/users" , userRoute)

app.listen(8080,()=> console.log("running on http://localhost:8080"))