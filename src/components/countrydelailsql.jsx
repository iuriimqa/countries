import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './countrydetail.css';

const CountryDetail = () => {
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [borderCountriesNames, setBorderCountriesNames] = useState([]);
    const { countryName } = useParams();

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await axios.get(`http://localhost:3021/country/${countryName}?fullText=true`);
                setCountry(response.data[0]);
                setLoading(false);
                if (response.data[0].borders) {
                    await fetchBorderCountriesNames(response.data[0].borders);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchCountry();
    }, [countryName]);

    const fetchBorderCountriesNames = async (borderCodes) => {
        try {
            const requests = borderCodes.map(code =>
                axios.get(`https://restcountries.com/v3.1/alpha/${code}`)
            );
            const responses = await Promise.all(requests);
            const names = responses.map(response => response.data[0].name.common);
            setBorderCountriesNames(names);
        } catch (error) {
            console.error('Error fetching border countries:', error);
            setBorderCountriesNames(borderCodes); // Fallback to codes on error
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    } else if (error) {
        return <div>Error: {error.message}</div>;
    } else if (country) {
        const {
            name,
            flags,
            population,
            region,
            subregion,
            capital,
            tld,
            currencies,
            languages
        } = country;

        return (
            <>
                <Link to="/"><button className="back-button"><i className="fas fa-arrow-left"></i>Back</button></Link>
                <div className="country-detail">
                    <div className="country-flag">
                        <img src={flags.svg} alt={`Flag of ${name.common}`} />
                    </div>
                    <div className="country-info">
                        <h2>{name.common}</h2>
                        <div className="country-stats">
                            <p><strong>Native Name:</strong> {name.official}</p>
                            <p><strong>Population:</strong> {population.toLocaleString()}</p>
                            <p><strong>Region:</strong> {region}</p>
                            <p><strong>Sub Region:</strong> {subregion}</p>
                            <p><strong>Capital:</strong> {capital}</p>
                            <p><strong>Top Level Domain:</strong> {tld && tld.join(', ')}</p>
                            <p><strong>Currencies:</strong> {currencies && Object.values(currencies).map(c => c.name).join(', ')}</p>
                            <p><strong>Languages:</strong> {languages && Object.values(languages).join(', ')}</p>
                        </div>
                        <div className="country-borders">
                            <p><strong>Border Countries:</strong></p>
                            <div className="borders-list">
                                {borderCountriesNames.map((name, index) => (
                                    <button key={index}>{name}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default CountryDetail;
