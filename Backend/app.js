require('dotenv').config(); //Comment

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

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

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

app.get('/home', (req, res) => {
    res.render('home');
})

app.get('/contact-us', (req, res) => {
    res.render('contact-us');
})

app.get('/supported-games', (req, res) => {
    res.render('supported-games');
})

app.get('/games/hyperlight-drifter', (req, res) => {
    res.render("game-pages/hyperlight-drifter");
})

app.post("/contact/send", async (req, res) => {

    try {

        const { subject, email, message } = req.body;

        console.log(subject);
        console.log(email);
        console.log(message);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_RECEIVER,
            replyTo: email,
            subject: `BackDoor Contact Form: ${subject}`,
            text: `From: ${email}, Message: ${message}`
        });

        res.json({
            success: true,
            message: "Form received"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Something Happened"
        })

    }
});