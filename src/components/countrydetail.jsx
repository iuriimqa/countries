import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './countrydetail.css';
import { useDarkMode } from './darkmodecontext';


const CountryDetail = () => {
    const { isDarkMode } = useDarkMode();
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { countryName } = useParams();

    useEffect(() => {
        const root = document.documentElement; 
        if (isDarkMode) {
          root.classList.add("dark-mode");
        } else {
          root.classList.remove("dark-mode");
        }
      }, [isDarkMode]);
      

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await axios.get(`https://countriapi-server.onrender.com/country/${countryName}`);
                setCountry(response.data); // Предполагаем, что данные страны приходят в нужном формате
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchCountry();
    }, [countryName]);

    if (loading) {
        return <div>Loading...</div>;
    } else if (error) {
        return <div>Error: {error.message}</div>;
    } else if (country) {
        // Доступ к дан

        return (
            <div className={`container ${isDarkMode ? "dark-mode" : ""}`}>
                <Link to="/"><button className={`back-button ${isDarkMode ? "dark-mode" : ""}`}><i className="fas fa-arrow-left"></i>Back</button></Link>
                <div className={`country-detail ${isDarkMode ? "dark-mode" : ""}`}>
                    <div className="country-flag">
                        <img src={country.flag} alt={`Flag of ${country.name}`} />
                    </div>
                    <div className="country-info">
                        <h2>{country.name}</h2>
                        <div className="country-stats">
                            <p><strong>Native Name:</strong> {country.officialName}</p>
                            <p><strong>Population:</strong> {country.population}</p>
                            <p><strong>Region:</strong> {country.region}</p>
                            <p><strong>Sub Region:</strong> {country.subregion}</p>
                            <p><strong>Capital:</strong> {country.capital}</p>
                            <p><strong>Top Level Domain:</strong> {country.tld}</p>
                            <p><strong>Currencies:</strong>{country.currencies}</p>
                            <p><strong>Languages:</strong> {country.languages}</p>

                            <p id="border"><strong>Border Countries:</strong></p>
                            <div className="borders-list">
                            {country.borders && country.borders.map((name, index) => (
                                <button key={index} className={`border-country ${isDarkMode ? "dark-mode" : ""}`}>{name}</button>
                            ))}
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default CountryDetail;
