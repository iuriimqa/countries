import React from 'react';
import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { useDarkMode } from './darkmodecontext'; // Правильно импортировать useDarkMode

function Navbar() {
    const { isDarkMode, toggleDarkMode } = useDarkMode(); // Использовать объект, а не массив

    return (
        <div className={isDarkMode ? "navbar dark-mode" : "navbar"}>
            <h1>Where in the world?</h1>
            <button className={`dark-mode-btn ${isDarkMode ? "dark-mode" : ""}`} onClick={toggleDarkMode}>
                <FontAwesomeIcon icon={faMoon} />
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </button>
        </div>
    );
}

export default Navbar;
