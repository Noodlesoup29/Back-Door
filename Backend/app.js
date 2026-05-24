import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

import { decodeHyperlight, encodeHyperlight } from "./decoding_algorithms/hyperlight-decoder.js";
import { decodeUndertale, encodeUndertale } from "./decoding_algorithms/undertale-decoder.js";
import { decodeCeleste, encodeCeleste } from "./decoding_algorithms/celeste-decoder.js";

import { analyzeSaveFile } from "./groq.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
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

app.get("/", (req, res) => {
  res.redirect("/home");
});

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
            descriptionPartial: "partials/catalog_descriptions/undertale-catalog",
            nameAsString : "Undertale Decoder"
        },
        "celeste": {
            descriptionPartial: "partials/catalog_descriptions/celeste-catalog",
            nameAsString : "Celeste Decoder"
        },
        "subnautica": {
            descriptionPartial: "partials/catalog_descriptions/subnautica-catalog",
            nameAsString : "Subnautica Decoder"
        },
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

app.post("/decoder/:gameName", (req, res) => {

    const fileText = req.body.fileText;
    const gameName = req.params.gameName;
    
    const decoders = {
        "hyperlight-drifter": decodeHyperlight,
        "undertale": decodeUndertale,
        "celeste": decodeCeleste,
        "subnautica": decodeHyperlight
    };

    const decoder = decoders[gameName];

    if (!decoder) {
        return res.status(404).json({
            success: false,
            message: "Unsupported game."
        });
    }

    const decodedText = decoder(fileText);

    res.json({
        success: true,
        decodedText: decodedText
    }); 

});

app.post("/encoder/:gameName", (req, res) => {

    const reqBody = req.body;
    const gameName = req.params.gameName;

    const encoders = {
        "hyperlight-drifter": encodeHyperlight,
        "undertale": encodeUndertale,
        "celeste": encodeCeleste,
        "subnautica": encodeHyperlight
    };

    const encoder = encoders[gameName];

    if (!encoder) {
        return res.status(404).json({
            success: false,
            message: "Unsupported game."
        });
    }

    const encodedText = encoder(
        reqBody.originalFileText,
        reqBody.updatedJson
    );

    res.json({
        success: true,
        encodedText: encodedText
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

app.post("/analyze-change", async(req, res) => {
    
    try{
        const { originalJSON, change, gameName } = req.body;

        const flag = await analyzeSaveFile(originalJSON, change, gameName);
        res.json(flag);
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to analyze change"
        })
    }
    
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
