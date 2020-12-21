import mongoose from 'mongoose'

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    phone: {
        type: String,
        minilength: 5
    },
    street: {
        type: String,
        required: true,
        minilength: 5
    },
    city: {
        type: String,
        required: true,
        minilength: 5
    }
})

const Person = mongoose.model('Person', personSchema)

export default Person  