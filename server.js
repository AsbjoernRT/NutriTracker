import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import Database from 'database.js'
import config from 'config.js'
const app = express();
const port = 4000;

// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'your_database_host',
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'NutriDB' // Assuming your database name is NutriDB
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error(`Error connecting to database: ${err}`);
        return;
    }
    console.log('Connected to database');
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST endpoint to handle form submission
app.post('/createuser', (req, res) => {
    const { fullname, password, email, age, weight, gender } = req.body;
    const database = new Database(config)
    database.createUser(user);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
