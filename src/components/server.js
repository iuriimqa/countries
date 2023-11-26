const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const app = express();
const port = 3021; 
const cors = require('cors');
require('dotenv').config();

const knex = require('knex')({
    client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' }
    }});





app.use(cors());
app.use(morgan('combined'));
app.use(express.json());


const apiEndpoint = 'https://restcountries.com/v3.1/all';

function insertCountryData(countriesData) {
    const transformedData = countriesData.map(country => ({
      name: JSON.stringify(country.name),
      tld: JSON.stringify(country.tld),
      cca2: country.cca2,
      ccn3: country.ccn3,
      cca3: country.cca3,
      cioc: country.cioc,
      independent: country.independent,
      status: country.status,
      unmember: country.unMember,
      currencies: JSON.stringify(country.currencies),
      idd: JSON.stringify(country.idd),
      capital: JSON.stringify(country.capital),
      altspellings: JSON.stringify(country.altSpellings),
      region: country.region,
      subregion: country.subregion,
      languages: JSON.stringify(country.languages),
      translations: JSON.stringify(country.translations),
      latlng: JSON.stringify(country.latlng),
      landlocked: country.landlocked,
      area: country.area,
      demonyms: JSON.stringify(country.demonyms),
      flag: country.flags.png, 
      maps: JSON.stringify(country.maps),
      population: country.population,
      car: JSON.stringify(country.car),
      timezones: JSON.stringify(country.timezones),
      continents: JSON.stringify(country.continents),
      flags: JSON.stringify(country.flags),
      coatofarms: JSON.stringify(country.coatOfArms),
      startofweek: country.startOfWeek,
      capitalinfo: JSON.stringify(country.capitalInfo),
      borders: JSON.stringify(country.borders)
    }));
  
    return knex('countries')
      .insert(transformedData)
      .onConflict(['name', 'cca3'])
    .merge() 
      .then(() => console.log('Data inserted into the database'))
      .catch(error => console.error('Error inserting data into the database', error));
  }
  


app.get('/countries', async (req, res) => {
    try {
        const countries = await knex.select('*').from('countries');
        if (countries.length === 0) {
            const apiResponse = await axios.get(apiEndpoint);
            await insertCountryData(apiResponse.data);
            res.json(apiResponse.data);
        } else {
            res.json(countries);
        }
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/search-countries/:substring', async (req, res) => {
    const { substring } = req.params;
    try {
        const searchPattern = `%${substring}%`; 
        const countries = await knex('countries')
            .whereRaw("name ->> 'common' ILIKE ?", [searchPattern])
            .select('*'); 

        res.json(countries); 
    } catch (error) {
        console.error('Error searching for countries:', error);
        res.status(500).json({ error: error.message });
    }
});




app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

app.get('/country/:countryName', async (req, res) => {
    const countryNameParam = decodeURIComponent(req.params.countryName);
    let searchQuery;
    
    if (countryNameParam.toLowerCase() === "united states of america" || countryNameParam.toLowerCase() === "republic of niger") {
        searchQuery = knex('countries').whereRaw("name ->> 'official' ILIKE ?", [`%${countryNameParam}%`]);
    } else {
        searchQuery = knex('countries').whereRaw("name ->> 'common' ILIKE ?", [`%${countryNameParam}%`]);
    }
    

    try {
        const country = await searchQuery.first();
        if (!country) {
            res.status(404).json({ message: 'Country not found' });
        } else {
            let borderNames = [];
            if (country.borders && country.borders.length > 0) {
                const borderCountries = await Promise.all(
                    country.borders.map(borderCode =>
                        knex('countries')
                            .where('cca3', borderCode)
                            .first()
                    )
                );
                borderNames = borderCountries.map(borderCountry => borderCountry ? borderCountry.name.common : null);
            }

            const response = {
                name: country.name.common,
                officialName: country.name.official,
                tld: country.tld,
                population: country.population,
                flag: country.flag,
                languages: Object.values(country.languages).join(', '),
                currencies: Object.entries(country.currencies).map(([code, { name, symbol }]) => `${name} (${symbol})`).join(', '),
                capital: country.capital,
                region: country.region,
                subregion: country.subregion,
                borders: borderNames.filter(Boolean)
            };
            res.json(response);
        }
    } catch (error) {
        console.error('Error fetching country details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// app.get('/country/:countryName', async (req, res) => {
//     let { countryName } = req.params;
//     countryName = decodeURIComponent(countryName);
//     console.log('Encoded country name:', encodedCountryName); // Выведет закодированное название
//     console.log('Decoded country name:', countryName)
//     try {
//         const country = await knex('countries')
//             .whereRaw("name ->> 'common' ILIKE ?", [`%${countryName}%`])
//             .first();

//         console.log('Country found:', country);

//         if (!country) {
//             res.status(404).json({ message: 'Country not found' });
//         } else {
//             console.log('Country found:', country);
            
//             country.name = JSON.parse(country.name);
//             country.tld = JSON.parse(country.tld);
//             country.currencies = JSON.parse(country.currencies);
//             country.languages = JSON.parse(country.languages);
//             // Не преобразовываем поля, которые не будем отображать

//             // Создаем объект ответа с нужными полями
//             const response = {
//                 name: country.name,
//                 tld: country.tld,
//                 population: country.population,
//                 flag:country.flag,
//                 languages:country.languages,
//                 currencies:country.currencies,
//             };

//             // Отправить данные клиенту
//             res.json(response);
//         }
//     } catch (error) {
//         console.error('Error fetching country details:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });
