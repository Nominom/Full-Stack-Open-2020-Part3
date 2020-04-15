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

app.get('/info', (req, res, next) => {
	Person.find({}).then(persons => {
		res.send(`
		<p>Phonebook has info for ${persons.length} people</p> 
		<p>${new Date()}</p>`)
	}).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
	console.log(request.params.id)
	Person.findById(request.params.id).then(person => {
		if (person) {
			response.json(person.toJSON())
		} else {
			response.status(404).end()
		}
	}).catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
	Person.find({}).then(persons => {
		res.json(persons)
	}).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

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
	}
	Person.findOne({ 'name': body.name }).then(existing => {
		
		if (existing) {
			return response.status(400).json({
				error: 'name must be unique'
			})
		} else {
			const person = new Person({
				name: body.name,
				number: body.number
			})

			person.save().then(savedPerson => {
				response.json(savedPerson.toJSON())
			}).catch(error => next(error))
		}
	}).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson.toJSON())
		})
		.catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else {
		response.status(500).end()
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})