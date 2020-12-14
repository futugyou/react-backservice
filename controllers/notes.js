import express from 'express'
import Note from '../models/note.js'
import User from '../models/user.js'

const notesRouter = express.Router()

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
        .populate('user', { id: 1, username: 1, name: 1 })
    response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
    const note = await Note.findById(request.params.id)
        .populate('user', { id: 1, username: 1, name: 1 })
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

notesRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

notesRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findById(body.userId)
    console.log(user)
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user._id
    })

    const result = await note.save()
    user.notes = user.notes.concat(result)
    await user.save()
    response.json(result)
})

notesRouter.put('/:id', async (request, response) => {
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
    const updatenote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
    response.json(updatenote)
})

export default notesRouter