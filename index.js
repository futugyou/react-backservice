import express from 'express'
import cors from 'cors'
import Note from './models/note.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get('/api/notes/:id', (req, res, next) => {
    Note
        .findById(req.params.id)
        .then(note => {
            if (note) {
                res.json(note)
            } else {
                res.status(404).end()
            }
        })
        .catch(err => next(err))
})

app.delete('/api/notes/:id', (req, res, next) => {
    Note
        .findByIdAndDelete(req.params.id)
        .then(result => {
            console.log('delete error:', result)
            res.status(204).end()
        })
        .catch(err => next(err))
})


app.post('/api/notes', (request, response, next) => {
    const body = request.body
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })
    note.save().then(result => {
        response.json(result)
    })
        .catch(err => next(err))
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    const note = {
        content: body.content,
        important: body.important || false
    }
    Note
        .findByIdAndUpdate(request.params.id, note, { new: true })
        .then(note => {
            response.json(note)
        })
        .catch(err => next(err))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
