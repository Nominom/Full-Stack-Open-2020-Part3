require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
morgan.token('json', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))
app.use(express.static('build'))

app.get('/info', (req, res, next) => {
	Person.find({}).then((persons) => {
		res.send(`
		<p>Phonebook has info for ${persons.length} people</p> 
		<p>${new Date()}</p>`)
	}).catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
	console.log(request.params.id)
	Person.findById(request.params.id).then((person) => {
		if (person) {
			response.json(person.toJSON())
		} else {
			response.status(404).end()
		}
	}).catch((error) => next(error))
})

app.get('/api/persons', (req, res, next) => {
	Person.find({}).then((persons) => {
		res.json(persons)
	}).catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const { body } = request

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save().then((savedPerson) => {
		response.json(savedPerson.toJSON())
	}).catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const { body } = request

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
		.then((updatedPerson) => {
			if (updatedPerson) {
				return response.json(updatedPerson.toJSON())
			}
			return response.status(404).json({ error: 'Person does not exist.', kind: 'missing' })
		})
		.catch((error) => next(error))
})


const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id', kind: 'validation' })
	} if (error.name === 'ValidationError') {
		console.log(error)
		return response.status(400).json({ error: error.message, kind: 'validation' })
	}

	next(error)
	return response.status(500).end()
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
