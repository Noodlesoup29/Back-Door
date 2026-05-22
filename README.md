# Back Door

A web app that makes save file manipulation easy.

## Description

Back Door is a Node.js, Express, EJS, and MongoDB web application designed to help users manage and manipulate game save files.

## Tech Stack

- Node.js
- Express.js
- EJS
- MongoDB
- CSS

## Features

- Home page
- Supported games page
- Contact page
- Reusable EJS partials
- Static image and GIF support

## Installation

Clone the repository:

```bash
git clone git@github.com:Noodlesoup29/Back-Door.git
```

Go into the project folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root of the `Backend` folder using `.env.example` as a guide:

`.env.example` notes:
- `EMAIL_USER`: The email "from". Uses an "app key" and can be any gmail account
- `EMAIL_PASS`: Obtained by going to your google acc and searching "App Passwords". Create one and copy it here with NO spaces
- `EMAIL_RECEIVER`: Email "to". Use your personal or junk email.

`EMAIL_USER` and `EMAIL_RECEIVER` can be the same. It just means that `EMAIL_USER` will send an email to `EMAIL_RECEIVER`, so "johndoe@gmail.com --sends email--> johndoe@gmail.com"

## Running the Project


```bash
nodemon app.js
```

Then open:

```txt
http://localhost:8080/home
```

Or if that doesn't work:
```txt
http://localhost:3000/home
```

## Routes

| Route | Page |
|---|---|
| `/home` | Home page |
| `/supported-games` | Supported games page |
| `/contact-us` | Contact page |

# API Keys
GROQ_API_KEY=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

## Author

Nathan Lor
