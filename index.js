const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(people => {
            response.json(people.map(formatPerson))
        })
})

app.get('/info', (request, response) => {
    const n = persons.length
    const date = new Date()
    response.send(`
    <div>
        <p>puhelinluettelossa on ${n} henkilön tiedot</p>
        <p>${date}</p>
    </div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

/*
generateId = () => {
    return Math.floor(Math.random() * 100) + persons.length
}
*/

personInPhonebook = (name) => {
    return persons.some(person => person.name === name)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === '' || body.number === '') {
        return response.status(400).send({ error: 'nimi tai numero puuttuu' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            response.json(formatPerson(savedPerson))
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
