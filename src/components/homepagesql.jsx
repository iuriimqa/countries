import React, { useState, useEffect,onKeyPress } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './homepage.css';
import CountryDetail from './countrydetail.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';

function HomePage() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');

  
  useEffect(() => {
    fetchAllCountries();
  }, []);

  const fetchAllCountries = () => {
    axios.get(`http://localhost:3021/countries`)
      .then(response => {
        setCountries(response.data);
        setRegion(response.data);
      })
      .catch(error => {
        console.error("Error fetching countries", error);
      });
  };

  const fetchCountriesByName = () => {
    console.log("Search query:", search);
    if (search) {
      axios.get(`http://localhost:3021/country/${search}`)
        .then(response => {
          setCountries(response.data);
        })
        .catch(error => {
          console.error("Error fetching countries", error);
        });
    } else {
      fetchAllCountries();
    }
  };

  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) {
      fetchAllCountries();
    }
  };

  const navigate = useNavigate();

  const handleCountryClick = (country) => {
    navigate(`country/${country.name.official}`);
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    if (selectedRegion) {
      setCountries(countries.filter(country => country.region === selectedRegion));
    } else {
      fetchAllCountries();
    }
  };

  return (
    <div className="container">
    <div className="filter">
      <div className="search-bar">
        <i className="search-icon fas fa-search" onClick={fetchCountriesByName}></i>
        <input
          placeholder="Search for a country"
          value={search}
          onChange={handleSearchChange}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              fetchCountriesByName();
            }
          }}
        />
      </div>
      <select value={region} onChange={handleRegionChange} className="region-select">
        <option className="dropdown-item" value="">Filter by Region</option>
        <option className="dropdown-item" value="Africa">Africa</option>
        <option className="dropdown-item" value="Americas">Americas</option>
        <option className="dropdown-item" value="Asia">Asia</option>
        <option className="dropdown-item" value="Europe">Europe</option>
        <option className="dropdown-item" value="Oceania">Oceania</option>
      </select>
    </div>
      <div className="cards">
        {countries.map((country) => (
          <div key={country.ccn3} className="country-card" onClick={() => handleCountryClick(country)}>
            <img id="pic" src={country.flags.png} alt="Country Flag" />
            <div className="small">
              <h3>{country.name.common}</h3>
              <p><span>Population:</span> {country.population}</p>
              <p><span>Region:</span> {country.region}</p>
              <p><span>Capital:</span> {country.capital}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
