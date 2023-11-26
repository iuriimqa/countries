const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const app = express();
const port = 3021; 
const cors = require('cors');
const { Pool } = require('pg');

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'template2',
//     password: 'admin',
//     port: 1233,
//   });

app.get('/countries', (req,res) => {
    axios.get('https://restcountries.com/v3.1/all')
        .then(apiResponse => {
            res.json(apiResponse.data);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
},

app.get('/country/:countryName', (req, res) => {
    const { countryName } = req.params;
    axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`)
        .then(apiResponse => {
            res.json(apiResponse.data);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
}));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
