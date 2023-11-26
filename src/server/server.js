const express = require('express');
const axios = require('axios');
const app = express();
const port = 3021; // Используйте порт, отличный от порта вашего фронтенд-сервера

app.use(express.json());

app.get('/api/country/:countryName', (req, res) => {
    const { countryName } = req.params;
    axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`)
        .then(apiResponse => {
            res.json(apiResponse.data);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
