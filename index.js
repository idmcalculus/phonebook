const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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

app.get('/info', (req,res) => {
	const info = `<p>Phonebook has info for ${persons.length} people<p>
		<p>${new Date().toUTCString()}</p>`;
	
	res.send(info);
});

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find(person => person.id === id);
	person ? res.json(person) : res.status(404).end();
});

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter(person => person.id !== id);
  
	res.status(204).end();
});

const generateId = (min, max) => {
	return Math.ceil(Math.random() * (max - min) + min);
};

app.post('/api/persons', (req, res) => {
	const body = req.body;
  
	if (!body.name || !body.number) {
	  return res.status(400).json({ 
		error: 'name or number missing' 
	  });
	}

	const foundPerson = persons.find(person => person.name === body.name);

	if (foundPerson) {
		res.status(400).json({
			error: 'name must be unique'
		});
	}
  
	const person = {
	  name: body.name,
	  number: body.number,
	  id: generateId(1, 1000),
	};
  
	persons = persons.concat(person);
	res.json(person);
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
	console.log(`App LIVE on port ${PORT}`);
});