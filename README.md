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

## Project Structure

```txt
Backend/
├── public/
│   ├── Photos/
│   └── style.css
├── views/
│   ├── game pages/
│   ├── partials/
│   │   └── navbar.ejs
│   ├── contact-us.ejs
│   ├── home.ejs
│   └── supported-games.ejs
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

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

Create a `.env` file in the root of the `Backend` folder:

```env
PORT=8080
```

## Running the Project


```bash
nodemon app.js
```

Then open:

```txt
http://localhost:8080/home
```

## Routes

| Route | Page |
|---|---|
| `/home` | Home page |
| `/supported-games` | Supported games page |
| `/contact-us` | Contact page |

## Author

Nathan Lor
