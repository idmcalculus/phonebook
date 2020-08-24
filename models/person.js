const mongoose = require('mongoose');
const dotenv = require('dotenv');
const uniqueValidator = require('mongoose-unique-validator');

dotenv.config();

const url = process.env.CONNECTION_URL;

console.log('connecting to', url);

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

const mongoClient = async () => {
	try {
	  const connected = await mongoose.connect(url);
	  if (connected) {
		console.log('connected to MongoDB');
	  }
	} catch (error) {
	  console.log('error connecting to MongoDB:', error.message);
	}
};
  
mongoClient();

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		minlength: 3
	},
	number: {
		type: String,
		required: true,
		minlength: 8
	}
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);