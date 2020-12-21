import pkg from 'apollo-server'
import Person from '../models/person.js'
const { ApolloServer, UserInputError, gql } = pkg

const typeDefs = gql`
type Address {
    street:String!
    city:String!
}

type Person {
    name :String!
    phone:String
    address:Address!
    id:ID!
}

enum YesNo {
    YES
    NO
}

type Query {
    personCount:Int!
    allPersons(phone: YesNo):[Person!]!
    findPerson(name:String!):Person
}

type Mutation {
    addPerson(
        name: String!
        phone: String
        street: String!
        city: String!
    ): Person
    editNumber(
        name:String!
        phone:String!
    ): Person
}

`
const resolvers = {
    Query: {
        personCount: () => Person.collection.countDocuments(),
        allPersons: (root, args) => {
            if (!args.phone) {
                return Person.find({})
            }
            return Person.find({ phone: { $exists: args.phone === 'YES' } })
        },
        findPerson: (root, args) =>
            Person.find({ name: args.name })
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    },
    Mutation: {
        addPerson: async (root, args) => {
            const p = await Person.findOne({ name: args.name })
            if (p) {
                throw new UserInputError('Name must be unique', {
                    invalidArgs: p.name,
                })
            }
            const person = new Person({ ...args })
            try {
                await person.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            return person
        },
        editNumber: async (root, args) => {
            const person = Person.findOne({ name: args.name })
            if (!person) {
                return null
            }
            person.phone = args.phone
            try {
                await person.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            return person
        }
    }
}

const hqlServer = new ApolloServer({
    typeDefs,
    resolvers,
})
export default hqlServer