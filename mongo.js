const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.js <password>')
	process.exit(1);
}
  
const password = process.argv[2];

const url = `mongodb+srv://idmcalculus:${password}@idmcalculus-c2zua.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 3) {
	const name = process.argv[3];
	const number = process.argv[4];
	const person = new Person({
		name, number
	});
	
	person.save().then(result => {
	  console.log(`added ${result.name} number ${result.number} to phonebook`);
	  mongoose.connection.close();
	});
} else {
	Person.find({})
	.then(result => {
		console.log('Phonebook:');
		result.forEach(person => {
			if (person.name !== undefined) {
				console.log(`${person.name} ${person.number}`);
			}
		});
		mongoose.connection.close();
	})
	.catch(err => {
		console.error(err);
	}); 
}