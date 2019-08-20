const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/expresss');
const exps = db.get('exps');
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.json({
		message: 'Expresss! &#x1F444 '
	});
});

app.get('/exps', (req, res) => {
	exps
		.find()
		.then(exp => {
			res.json(exp);
	});
});

function isValidExp(exp) {
	return exp.name && exp.name.toString().trim() !== '' && exp.content && exp.content.toString().trim() !== '';
}

app.use(rateLimit({
	windowMs: 30 * 1000, //30 seconds
	max: 1 //limit each IP to 100 request per windowMs
}));

app.post('/exps', (req,res) => {
	if(isValidExp(req.body)) {
		//insert into db
		const exp = {
			name: filter.clean(req.body.name.toString()),
			content: filter.clean(req.body.content.toString()),
			created: new Date()
		};
		
		exps
			.insert(exp)
			.then(createdExp => {
				res.json(createdExp);
		});
	} else {
		res.status(422);
		res.json({
			message: 'Hey! Name and Content are required!'
		});
	}
});

app.listen(5000, () => {
	console.log('Listening on http://localhost:5000');
});