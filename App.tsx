
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
import ManageEquipmentPage from './pages/seller/ManageEquipmentPage';
import AddEquipmentPage from './pages/seller/AddEquipmentPage';
import BookingRequestsPage from './pages/seller/BookingRequestsPage';
import LabourerHomePage from './pages/labourer/LabourerHomePage';
import ProfileSetupPage from './pages/labourer/ProfileSetupPage';
import JobListingsPage from './pages/labourer/JobListingsPage';
import JobDetailsPage from './pages/labourer/JobDetailsPage';
import MyApplicationsPage from './pages/labourer/MyApplicationsPage';
import DatabaseViewerPage from './pages/DatabaseViewerPage';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Farmer Routes */}
          <Route path="/farmer" element={<FarmerHomePage />} />
          <Route path="/farmer/rent-equipment" element={<RentEquipmentPage />} />
          <Route path="/farmer/smart-diversification" element={<SmartDiversificationPage />} />
          <Route path="/farmer/weather-forecast" element={<WeatherForecastPage />} />
          <Route path="/farmer/market-price" element={<MarketPricePage />} />
          <Route path="/farmer/hire-labour" element={<HireLabourPage />} />

          {/* Seller Routes */}
          <Route path="/seller" element={<SellerHomePage />} />
          <Route path="/seller/equipment" element={<ManageEquipmentPage />} />
          <Route path="/seller/equipment/add" element={<AddEquipmentPage />} />
          <Route path="/seller/bookings" element={<BookingRequestsPage />} />

          {/* Labourer Routes */}
          <Route path="/labourer" element={<LabourerHomePage />} />
          <Route path="/labourer/profile" element={<ProfileSetupPage />} />
          <Route path="/labourer/jobs" element={<JobListingsPage />} />
          <Route path="/labourer/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/labourer/applications" element={<MyApplicationsPage />} />

          {/* Admin Routes */}
          <Route path="/admin/database" element={<DatabaseViewerPage />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;