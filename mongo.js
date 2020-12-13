import mongoose from 'mongoose'

if (process.argv.length < 3) {
    console.log('please provide the password as an arhument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://futugyousuzu:${password}@cluster0.gjpfl.mongodb.net/react-app?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const noteSchema = new mongoose.Schema({
    content: String,
    data: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'HTML is EASY',
    date: new Date(),
    important: true
})

note.save().then(result => {
    console.log('note saved')
    mongoose.connection.close()
})

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})