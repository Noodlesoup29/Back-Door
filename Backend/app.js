require('dotenv').config(); //Comment

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const {decodeHyperlight, encodeHyperlight} = require("./decoding_algorithms/hyperlight-decoder");

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

app.get("/games/:gameName", (req, res) => {

    const gameData = {
        "hyperlight-drifter": {
            descriptionPartial: "partials/catalog_descriptions/hyperlight-catalog",
            nameAsString : "Hyperlight Drifter Decoder"
        },
        "undertale": {
            descriptionPartial: "partials/catalog_descriptions/undertale-catalogue",
            nameAsString : "Undertale Decoder"
        }
    };

    const gameName = req.params.gameName;
    const game = gameData[gameName];

    if (!game) {
        return res.status(404).send("Game not found");
    }

    res.render("game-specific", {
        gameName,
        game
    });
    
});

app.post("/decoder/hyper-light", (req, res) => {

    const fileText = req.body.fileText;

    const decodedText = decodeHyperlight(fileText);

    res.json({
        success: true,
        decodedText: decodedText
    }); 

});

app.post("/encoder/hyper-light", (req, res) => {

    const reqBody = req.body;

    const decodedText = encodeHyperlight(reqBody.originalFileText, reqBody.updatedJson);

    res.json({
        success: true,
        decodedText: decodedText
    }); 

});

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

