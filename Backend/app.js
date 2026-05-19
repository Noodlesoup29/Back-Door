require('dotenv').config(); //Comment

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(morgan('dev'));
app.use(express.json());

app.get('/home', (req, res) => {
    res.render('home');
})

app.get('/contact-us', (req, res) => {
    res.render('contact-us');
})

app.get('/supported-games', (req, res) => {
    res.render('supported-games');
})