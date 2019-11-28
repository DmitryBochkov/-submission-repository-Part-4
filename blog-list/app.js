const express = require('express')
const app = express()
const config = require('./utils/config')
const bodyParser = require('body-parser')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Error connection to MongoDB:', err.message)
  })

app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)

module.exports = app