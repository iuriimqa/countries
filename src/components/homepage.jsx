import React, { useState, useEffect,onKeyPress } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './homepage.css';
import CountryDetail from './countrydetail.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDarkMode } from './darkmodecontext';

function HomePage() {
  const { isDarkMode } = useDarkMode();
  const componentClass = isDarkMode ? 'dark-mode' : 'light-mode';
  const [allCountries, setAllCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');


  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-mode");
    } else {
      root.classList.remove("dark-mode");
    }
  }, [isDarkMode]);
  
  
  useEffect(() => {
    fetchAllCountries();
  }, []);

  const fetchAllCountries = () => {
    axios.get(`http://localhost:3021/countries`)
      .then(response => {
        setAllCountries(response.data);
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
      axios.get(`http://localhost:3021/search-countries/${search}`)
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
    // Если общее название страны 'United States', используем официальное название для запроса
    const countryQuery = country.name.common === 'United States' ? country.name.official : country.name.common;
    navigate(`/country/${encodeURIComponent(countryQuery)}`);
};



  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    const filteredCountries = selectedRegion

    ? allCountries.filter(country => country.region === selectedRegion)
      : allCountries;
    setCountries(filteredCountries);
  };

  return (
    <div className={`container ${isDarkMode ? "dark-mode" : ""}`}>
    <div className="filter">
      <div className={`search-bar ${isDarkMode ? "dark-mode" : ""}`}>
        <i className="search-icon fas fa-search" onClick={fetchCountriesByName}></i>
        <input className={`input ${isDarkMode ? "dark-mode" : ""}`}
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
      <select value={region} onChange={handleRegionChange} className={`region-select ${isDarkMode ? "dark-mode" : ""}`}>
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
          <div key={country.ccn3} className={`country-card ${isDarkMode ? "dark-mode" : ""}`} onClick={() => handleCountryClick(country)}>
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
