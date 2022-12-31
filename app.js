const express = require("express")
const app = express()

require('express-async-errors')
require('dotenv').config()

const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")
const connectDB = require("./db/connect")
const productsRouter = require("./routes/products")

app.use(express.json())

//routes
app.get('/', (req,res)=>{
    res.send('<h1>Product Store</h1><a href="/api/v1/products">Click to go to products page</a>')
})

app.use('/api/v1/products',productsRouter);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000 

const start = async (req,res) =>{
    try {
        //connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server in listening port ${port}...`));
    } catch (error) {
        console.log(error)
    }
}

start();
