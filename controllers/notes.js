import express from 'express'
import Note from '../models/note.js'

const notesRouter = express.Router()

notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})     

notesRouter.get('/:id', (request, response, next) => {
    Note
        .findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(err => next(err))
})

notesRouter.delete('/:id', (request, response, next) => {
    Note
        .findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(err => next(err))
})

notesRouter.post('/', (request, response, next) => {
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
    note.save()
        .then(result => {
            response.json(result)
        })
        .catch(err => next(err))
})

notesRouter.put('/:id', (request, response, next) => {
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

export default notesRouter