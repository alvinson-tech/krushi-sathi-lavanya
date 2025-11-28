
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import FarmerHomePage from './pages/farmer/FarmerHomePage';
import RentEquipmentPage from './pages/farmer/RentEquipmentPage';
import SmartDiversificationPage from './pages/farmer/SmartDiversificationPage';
import WeatherForecastPage from './pages/farmer/WeatherForecastPage';
import MarketPricePage from './pages/farmer/MarketPricePage';
import HireLabourPage from './pages/farmer/HireLabourPage';
import SellerHomePage from './pages/seller/SellerHomePage';
import LabourerHomePage from './pages/labourer/LabourerHomePage';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/farmer" element={<FarmerHomePage />} />
          <Route path="/farmer/rent-equipment" element={<RentEquipmentPage />} />
          <Route path="/farmer/smart-diversification" element={<SmartDiversificationPage />} />
          <Route path="/farmer/weather-forecast" element={<WeatherForecastPage />} />
          <Route path="/farmer/market-price" element={<MarketPricePage />} />
          <Route path="/farmer/hire-labour" element={<HireLabourPage />} />
          <Route path="/seller" element={<SellerHomePage />} />
          <Route path="/labourer" element={<LabourerHomePage />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;