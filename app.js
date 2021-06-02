require("dotenv").config();
const mysql = require("mysql2");
const express = require('express');
const serverPort = 8000;
// init the express app
const app = express();
// define the index route

app.use(express.json())

const connection = mysql.createConnection({
    host: process.env.DB_HOST, // address of the server
    port: process.env.DB_PORT, // port of the DB server (mysql), not to be confused with the nodeJS server PORT !
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
    } else {
        console.log('connected to database with threadId :  ' + connection.threadId);
    }
});

app.get('/api/movies', (req, res) => {
    connection.query('SELECT * FROM movies', (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving data from database');
        } else {
            res.status(200).json(result);
        }
    });
});

app.get('/api/movies/:id', (req, res) => {
    connection.query(
        'SELECT * FROM movies WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if (err) {
                res.status(500).send('Error retrieving a user from database');
            } else {
                res.json(results[0]);
            }
        }
    );
});

app.post('/api/movies', (req, res) => {
    const { title, director, year, color, duration } = req.body;
    connection.query(
        'INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)',
        [title, director, year, color, duration],
        (err, result) => {
            if (err) {
                res.status(500).send('Error saving the movie');
            } else {
                res.status(201).send('Movie successfully saved');
            }
        }
    );
});

app.put('/api/movies/:id', (req, res) => {
    const movieId = req.params.id;
    const moviePropsToUpdate = req.body;
    connection.query(
        'UPDATE movies SET ? WHERE id = ?',
        [moviePropsToUpdate, movieId],
        (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error updating a movie');
            } else {
                res.status(200).send('Movie updated successfully 🎉');
            }
        }
    );
});

app.delete('/api/movies/:id', (req, res) => {
    const movieId = req.params.id;
    connection.query(
        'DELETE FROM movies WHERE id = ?',
        [movieId],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('😱 Error deleting a movie');
            } else {
                res.status(200).send('🎉 Movie deleted!');
            }
        }
    );
});

// listen to incoming requests
app.listen(serverPort, () => console.log('Express server is running'));
