import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import Note from '../models/note.js'

const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
    },
]

beforeEach(async () => {
    await Note.deleteMany({})
    let noteObject = new Note(initialNotes[0])
    await noteObject.save()
    noteObject = new Note(initialNotes[1])
    await noteObject.save()
})

const api = supertest(app)

test('notes are retuened as json', async () => {
    await api.get('/api/notes').expect(200).expect('Content-Type', /application\/json/)
})

test('there are two motes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about http methods', async () => {
    const response = await api.get('/api/notes')    
    const contents = response.body.map(r=>r.content)
    // must match exactly , all word
    expect(contents).toContain('HTML is easy')
})

afterAll(() => {
    mongoose.connection.close()
})