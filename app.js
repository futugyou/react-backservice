import config from './utils/config.js'
import express from 'express'
import 'express-async-errors'
import notesRouter from './controllers/notes.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import testingRouter from './controllers/testing.js'
import cors from 'cors'
import middleware from './utils/middleware.js'
import logger from './utils/logger.js'
import mongoose from 'mongoose'

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(result => {
    logger.info('connected to mongodb')
}).catch((error) => {
    logger.error('error conntecting to mongodb:', error.message)
})

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app