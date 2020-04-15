require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
morgan.token('json', (req) => {
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))
app.use(express.static('build'))

app.get('/info', (req, res) => {
	Person.find({}).then(persons => {
		res.send(`
		<p>Phonebook has info for ${persons.length} people</p> 
		<p>${new Date()}</p>`)
	})
})

app.get('/api/persons/:id', (request, response) => {
	console.log(request.params.id)
	Person.findById(request.params.id).then(person => {
		if (person) {
			response.json(person.toJSON())
		} else {
			response.status(404).end()
		}
	})
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})

// app.delete('/api/persons/:id', (request, response) => {
// 	const id = Number(request.params.id)
// 	persons = persons.filter(person => person.id !== id)

// 	response.status(204).end()
// })

const generateId = () => Math.floor(Math.random() * 9999999)

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name) {
		return response.status(400).json({
			error: 'name missing'
		})
	}
	else if (!body.number) {
		return response.status(400).json({
			error: 'number missing'
		})
	} else if (persons.find(p => p.name === body.name)) {
		return response.status(400).json({
			error: 'name must be unique'
		})
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	}

	persons = persons.concat(person)

	response.json(person)
})



const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})