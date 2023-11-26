import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/homepage';
import CountryDetail from './components/countrydetail';
import Navbar from './components/header';
import { DarkModeProvider } from './components/darkmodecontext';


function App() {
  return (
    <DarkModeProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/country/:countryName" element={<CountryDetail />} />
      </Routes>
    </Router>
    </DarkModeProvider>
  );
}

export default App;
