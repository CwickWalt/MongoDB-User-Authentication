const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRoute = require('./routes/users');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('', usersRoute);

//connect to mongoDB

mongoose.connect('mongodb://localhost:27017/users_project', {useNewUrlParser: true})
.then(() => {
	console.log('Connected to database');
})
.catch(() => {
	console.log('Connection failed!');
});

//Listening on server

app.listen(3000);