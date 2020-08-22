const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const errorHandler = require('./middlewares/handleError');

const app = express();

morgan.token('body', function (req, res) { return JSON.stringify(req.body); });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 1
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 2
    },
    {
      "name": "Damilola Ige",
      "number": "08138875085",
      "id": 3
    },
    {
      "name": "Temitope Ige",
      "number": "08133077936",
      "id": 4
    },
    {
      "name": "Jumoke Ige",
      "number": "07033892211",
      "id": 5
    }
  ];

app.get('/', (req,res) => {
	res.send(`<h1>Welcome to my Phonebook App</>`);
});

app.get('/info', async (req,res) => {
	try {
		const persons = await Person.find({});
		const info = `<p>Phonebook has info for ${persons.length} people<p>
		<p>${new Date().toUTCString()}</p>`;
		res.send(info);
	} catch (error) {
		next(error);
	}
});

app.get('/api/persons/:id', async (req, res, next) => {
	try {
		const person = await Person.findById(req.params.id);
		if (person) {
			res.json(person);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		next(error);
	}
});

app.get('/api/persons', async (req, res, next) => {
	try {
		const persons = await Person.find({});
		res.json(persons);
	} catch (error) {
		next(error);
	}
 });

app.delete('/api/persons/:id', async (req, res, next) => {
	try {
		const deletedPerson = await Person.findByIdAndRemove(req.params.id);
		if (deletedPerson) {
			res.status(204).end();
		}
	} catch (error) {
		next(error);
	}
});

app.post('/api/persons', async (req, res, next) => {
	const body = req.body;
  
	if (!body.name || !body.number) {
	  return res.status(400).json({ 
		error: 'name or number missing' 
	  });
	}

	/* const name = body.name;
	const foundPerson = await Person.findOne({name});
	console.log(foundPerson);
	if (foundPerson) {
		const person = {
			name,
			number: body.number
		};
	
		try {
			const updatedPerson = await Person.findByIdAndUpdate(foundPerson._id, person, { new: true });
			res.json(updatedPerson);
		} catch(error) {
			next(error);
		}
	} */
  
	const person = new Person({
	  name: body.name,
	  number: body.number
	});

	try {
		const newPerson = await person.save();
		res.json(newPerson);
	} catch (error) {
		next(error);
	}
});

app.put('/api/persons/:id', async (req, res, next) => {
	const body = await req.body;

	const person = {
		name: body.name,
		number: body.number
	}

	try {
		const updatedPerson = await Person.findByIdAndUpdate(req.params.id, person, { new: true });
		res.json(updatedPerson);
	} catch(error) {
		next(error);
	}
})

app.use(errorHandler);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
	console.log(`App LIVE on port ${PORT}`);
});