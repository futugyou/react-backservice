import express from 'express'
import Note from '../models/note.js'

const notesRouter = express.Router()

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
    try {
        const note = await Note.findById(request.params.id)
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

notesRouter.delete('/:id', async (request, response, next) => {
    try {
        await Note.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

notesRouter.post('/', async (request, response, next) => {
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

    try {
        const result = await note.save()
        response.json(result)
    } catch (error) {
        next(error)
    }
})

notesRouter.put('/:id', async (request, response, next) => {
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
    try {
        const updatenote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
        response.json(updatenote)
    } catch (error) {
        next(error)
    }
})

export default notesRouter