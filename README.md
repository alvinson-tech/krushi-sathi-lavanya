# Krushi Sathi 🌾

## Overview

**Krushi Sathi** is a comprehensive agricultural technology platform designed to empower Indian farmers by connecting them with modern farming equipment, skilled labor, real-time market prices, weather intelligence, and smart crop diversification strategies. Built with React, TypeScript, and Tailwind CSS, this web application bridges the gap between farmers, equipment sellers, and agricultural laborers.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Detailed File Descriptions](#detailed-file-descriptions)
5. [Installation & Setup](#installation--setup)
6. [Usage Guide](#usage-guide)
7. [User Roles](#user-roles)
8. [Key Functionalities](#key-functionalities)
9. [Multi-Language Support](#multi-language-support)
10. [Future Enhancements](#future-enhancements)

---

## Features

### For Farmers 👨‍🌾
- **Equipment Rental**: Browse and book tractors, harvesters, rotavators, and other farming equipment
- **Labor Hiring**: Connect with verified, skilled farm laborers with transparent pricing
- **Smart Diversification**: AI-powered dual-crop strategies for higher yields and year-round income
- **Weather Forecast**: Real-time, location-based weather updates with 5-day forecasts
- **Live Market Pricing**: Track real-time commodity prices across different markets and states
- **Multi-Language Support**: Available in 8 Indian languages (English, Hindi, Marathi, Tamil, Telugu, Kannada, Gujarati, Bengali)

### For Sellers 🏪
- **Listing Management**: Create and manage equipment and agricultural input listings
- **Booking Dashboard**: Track active bookings, earnings, and customer requests
- **Analytics**: View weekly sales trends and performance metrics
- **Communication Hub**: Direct messaging with farmers for inquiries and support
- **Inventory Control**: Manage equipment availability and pricing dynamically

### For Laborers 👷
- **Job Marketplace**: Access to verified farming job opportunities
- **Profile Management**: Showcase skills, experience, and availability
- **Transparent Pricing**: Clear daily rates and job descriptions

---

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.8.3
- **Routing**: React Router DOM 7.9.6
- **Styling**: Tailwind CSS (via CDN)
- **Build Tool**: Vite 6.2.0
- **State Management**: React Context API (for language)
- **Storage**: LocalStorage & SessionStorage
- **APIs**: 
  - OpenStreetMap (Nominatim) for geolocation
  - OpenWeatherMap for weather data

---

## Project Structure

```
krushi-sathi/
├── .gitignore                      # Git ignore rules
├── App.tsx                         # Main application component with routing
├── index.html                      # HTML entry point
├── index.tsx                       # React entry point
├── metadata.json                   # App metadata
├── package.json                    # Dependencies and scripts
├── package-lock.json               # Locked dependencies
├── README.md                       # Project documentation (this file)
├── tsconfig.json                   # TypeScript configuration
├── types.ts                        # Global TypeScript type definitions
├── vite.config.ts                  # Vite build configuration
│
├── contexts/
│   └── LanguageContext.tsx         # Multi-language context provider
│
├── pages/
│   ├── LandingPage.tsx             # Public landing page
│   ├── LoginPage.tsx               # User authentication page
│   ├── RegistrationPage.tsx        # User registration page
│   │
│   ├── farmer/
│   │   ├── FarmerHomePage.tsx      # Farmer dashboard
│   │   ├── RentEquipmentPage.tsx   # Equipment rental marketplace
│   │   ├── HireLabourPage.tsx      # Labor hiring interface
│   │   ├── SmartDiversificationPage.tsx  # Crop diversification strategies
│   │   ├── WeatherForecastPage.tsx # Weather intelligence
│   │   └── MarketPricePage.tsx     # Live commodity pricing
│   │
│   ├── seller/
│   │   └── SellerHomePage.tsx      # Seller dashboard with analytics
│   │
│   └── labourer/
│       └── LabourerHomePage.tsx    # Laborer job marketplace
│
└── services/
    └── db.ts                       # Local database service (localStorage wrapper)
```

---

## Detailed File Descriptions

### Root Level Files

#### `.gitignore`
Specifies intentionally untracked files that Git should ignore:
- `node_modules/` - Dependencies
- `dist/` - Build output
- `*.local` - Local environment files
- Editor-specific directories (`.vscode/`, `.idea/`)

#### `App.tsx`
The main React component that orchestrates the entire application:
- Wraps the app in `LanguageProvider` for multi-language support
- Configures `HashRouter` for client-side routing
- Defines all application routes for different user roles
- Routes include landing page, authentication, and role-specific dashboards

#### `index.html`
The single-page application shell:
- Imports Tailwind CSS via CDN for styling
- Configures custom Tailwind theme with brand colors (`brand-green`, `brand-yellow`, `brand-brown`)
- Defines custom animations (fade-in, float, sparkle, shimmer)
- Sets up React import maps for ESM modules
- Includes custom scrollbar hiding and sparkle effects

#### `index.tsx`
React application entry point:
- Creates the root React element
- Renders the `App` component in StrictMode
- Mounts the application to the DOM

#### `package.json`
Project configuration and dependencies:
- **Scripts**: `dev` (development server), `build` (production build), `preview` (preview build)
- **Dependencies**: React, React DOM, React Router DOM
- **DevDependencies**: TypeScript, Vite, Vite React plugin, Node types

#### `tsconfig.json`
TypeScript compiler configuration:
- Target: ES2022 with DOM support
- Module system: ESNext with bundler resolution
- Enables JSX with React 17+ automatic runtime
- Path aliases (`@/*` maps to project root)
- Experimental decorators enabled

#### `types.ts`
Global TypeScript type definitions:
```typescript
- UserRole: 'FARMER' | 'SELLER' | 'LABOURER'
- User: Complete user object with id, name, email, password, role
- UserRegistrationData: User data without auto-generated id
```

#### `vite.config.ts`
Vite build tool configuration:
- Development server on port 3000
- React plugin integration
- Environment variable injection (Gemini API key)
- Path aliases resolution for clean imports

---

### Contexts

#### `contexts/LanguageContext.tsx`
**Purpose**: Provides multi-language support across the entire application

**Key Features**:
- Manages current language state (8 languages supported)
- Persists language preference in localStorage
- Provides translation function `t(key)` to all components
- Includes translations for common UI elements (welcome, logout, feature names)

**Languages Supported**:
- English (en), Hindi (hi), Marathi (mr), Tamil (ta), Telugu (te), Kannada (kn), Gujarati (gu), Bengali (bn)

**Usage Example**:
```typescript
const { language, setLanguage, t } = useLanguage();
<button>{t('logout')}</button>
```

---

### Pages

#### `pages/LandingPage.tsx`
**Purpose**: Marketing page showcasing platform features

**Components**:
- **Header**: Navigation with login button
- **HeroSection**: Animated hero banner with gradient background and brand messaging
- **FeaturesSection**: 6 feature cards (equipment rental, labor services, weather, diversification, market pricing, multi-language)
- **HowItWorksSection**: 5-step process visualization (Search → Compare → Book → Track → Pay)
- **ShowcaseSection**: Image showcase highlighting mobile-first design
- **StatsSection**: Animated counters showing platform statistics
- **TestimonialsSection**: Rotating farmer testimonials with carousel
- **CtaSection**: Call-to-action banner encouraging sign-up
- **Footer**: Links and copyright information

**Animations**: Intersection Observer-based reveal animations for smooth scrolling experience

---

#### `pages/LoginPage.tsx`
**Purpose**: User authentication interface

**Key Features**:
- **Role Selection**: Sliding tab selector for Farmer/Seller/Laborer
- **Dynamic Background**: Rotating agricultural images with fade transitions
- **Form Validation**: Email and password validation
- **Role Verification**: Ensures users login with their registered role
- **Error Handling**: Displays authentication errors inline
- **Responsive Design**: Mobile-optimized with backdrop blur effects

**Flow**:
1. User selects role (default: Farmer)
2. Enters credentials
3. System validates against localStorage database
4. Redirects to role-specific dashboard on success

---

#### `pages/RegistrationPage.tsx`
**Purpose**: New user account creation

**Key Features**:
- **Multi-Role Support**: Single registration form for all user types
- **Password Confirmation**: Double-entry password validation
- **Duplicate Detection**: Prevents multiple accounts with same email
- **Visual Consistency**: Matches LoginPage design language
- **Immediate Feedback**: Real-time validation and error messages

**Data Captured**:
- Full name
- Email address
- Password (hashed in production)
- User role (Farmer/Seller/Laborer)

---

### Farmer Pages

#### `pages/farmer/FarmerHomePage.tsx`
**Purpose**: Main dashboard for farmers

**Key Sections**:
1. **Header**: 
   - User avatar with upload capability (localStorage-based)
   - Location detection using Geolocation API + Nominatim reverse geocoding
   - Language selector dropdown
   - Logout button

2. **Hero Banner**: 
   - 3 rotating slides showcasing core features
   - Parallax scroll effect
   - Auto-carousel with manual controls

3. **Quick Actions Grid**:
   - 5 large action cards (Equipment Rental, Labor Hiring, Weather, Diversification, Market Pricing)
   - Each card features high-quality images, descriptions, and direct navigation
   - Hover effects with scale and overlay animations

**Technical Highlights**:
- Localized copy system with 8 language variants
- Real-time geolocation with fallback to coordinates
- Profile picture persistence in localStorage (base64 encoding)

---

#### `pages/farmer/RentEquipmentPage.tsx`
**Purpose**: Equipment rental marketplace

**Features**:
- **Equipment Catalog**: 6 equipment types (Tractor, Harvester, Rotavator, Sprayer, Plough, Seed Drill)
- **Horizontal Scroll Gallery**: Touch-friendly carousel with navigation arrows
- **Availability Indicators**: Real-time status badges (Available/Booked)
- **Pricing Information**: Hourly/daily rates with distance from user
- **Instant Booking**: One-click booking with confirmation

**Data Displayed per Item**:
- Equipment name and image
- Rental rate (per hour/day)
- Distance from farmer
- Availability status
- Brief description

---

#### `pages/farmer/HireLabourPage.tsx`
**Purpose**: Connect farmers with skilled laborers

**Features**:
- **Skill Filtering**: Filter by specialization (Harvesting, Sowing, Irrigation, Weeding, etc.)
- **Laborer Profiles**: 
  - Profile photo
  - Name and skill
  - Experience years
  - Star rating (1-5)
  - Completed jobs count
  - Daily rate
  - Location
  - Contact phone
  - Languages spoken

- **Instant Hire**: Direct contact initiation with phone number

**Profile Cards**: Elevated design with hover animations and comprehensive worker information

---

#### `pages/farmer/SmartDiversificationPage.tsx`
**Purpose**: AI-powered crop diversification strategies

**Features**:
- **Strategy Cards**: 4 dual-crop combinations
  1. Wheat + Mustard (Rabi season)
  2. Rice + Fish Farming (Kharif season)
  3. Sugarcane + Intercropping (Year-round)
  4. Cotton + Pulses (Kharif season)

- **Benefits Visualization**: Each strategy shows:
  - Seasonal timing
  - Expected benefits (yield increase, soil health, income diversification)
  - High-quality agricultural imagery
  - "Learn More" call-to-action

**Purpose**: Helps farmers maximize land productivity and reduce monocropping risks

---

#### `pages/farmer/WeatherForecastPage.tsx`
**Purpose**: Real-time weather intelligence for crop planning

**Features**:
- **Current Weather**: 
  - Temperature, condition (Sunny/Cloudy/Rainy)
  - Humidity percentage
  - Wind speed
  - Rain probability
  - Sunrise/sunset times

- **5-Day Forecast**: Daily high/low temperatures with weather icons

- **City Search**: Dynamic location search with OpenWeatherMap API

- **Fallback Mechanism**: Mock data generation when API fails (for demo purposes)

**API Integration**:
- OpenWeatherMap API for real weather data
- Graceful fallback to mock data for reliability
- Rate limiting and error handling

---

#### `pages/farmer/MarketPricePage.tsx`
**Purpose**: Real-time commodity price tracking

**Features**:
- **Market Selection**: Dropdown for 8 major Indian cities
- **Crop Selection**: 10 common crops/vegetables
- **Live Pricing**: Real-time price per quintal
- **Trend Indicators**: Up/down/stable arrows with percentage change
- **Multi-Market Comparison**: View prices across different mandis

**Price Cards Display**:
- Current price (₹)
- Price unit (per quintal)
- Trend direction and percentage change
- Market location

**Use Case**: Helps farmers identify best selling opportunities and timing

---

### Seller Pages

#### `pages/seller/SellerHomePage.tsx`
**Purpose**: Comprehensive seller dashboard with business analytics

**Key Sections**:

1. **Summary Cards**:
   - Active Listings count
   - Monthly earnings (₹)
   - Upcoming bookings
   - Average rating

2. **Quick Actions**:
   - Add New Equipment
   - Add Pesticide/Fertilizer
   - Manage Listings
   - Messages & Inquiries

3. **Sales Analytics**:
   - Weekly booking bar chart
   - Daily average calculations
   - Top equipment identification

4. **Active Listings**:
   - Horizontal scrollable gallery
   - Equipment status (Available/Low Stock/Paused)
   - Edit/Pause controls per listing
   - Image, price, rating, and booking count

5. **Booking Requests**:
   - Pending farmer requests
   - Equipment/input details
   - Time slots
   - Accept/Reject actions

6. **Messages Hub**:
   - Unread message indicators
   - Farmer inquiries
   - Quick response interface

7. **Promotional Tips**:
   - Best practices for higher visibility
   - Image quality recommendations
   - Response time targets

**Design Philosophy**: Information-dense dashboard optimized for business management

---

### Laborer Pages

#### `pages/labourer/LabourerHomePage.tsx`
**Purpose**: Job marketplace for agricultural laborers

**Current State**: Placeholder implementation with "Coming Soon" message

**Planned Features**:
- Job listings from farmers
- Skill-based job matching
- Application tracking
- Earnings history
- Availability calendar

---

### Services

#### `services/db.ts`
**Purpose**: Local database abstraction layer using browser storage

**Key Functions**:

1. **User Management**:
   ```typescript
   registerUser(userData): Promise<User>
   - Creates new user account
   - Checks for duplicate emails
   - Stores in localStorage
   
   loginUser(email, password): Promise<User>
   - Validates credentials
   - Returns user object on success
   
   getUsers(): User[]
   - Retrieves all registered users
   
   saveUsers(users): void
   - Persists users to localStorage
   ```

2. **Session Management**:
   ```typescript
   setCurrentUser(user): void
   - Stores active session in sessionStorage
   
   getCurrentUser(): User | null
   - Retrieves current logged-in user
   
   logoutUser(): void
   - Clears session data
   ```

**Storage Keys**:
- `krushi-sathi-users`: User database (localStorage)
- `krushi-sathi-session`: Active session (sessionStorage)

**Why LocalStorage?**
- No backend required for MVP/demo
- Instant setup for development
- Easy migration to real database later
- Data persists across browser sessions

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd krushi-sathi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional):
   Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**:
   Navigate to `http://localhost:3000`

6. **Build for production**:
   ```bash
   npm run build
   npm run preview
   ```

---

## Usage Guide

### First-Time User Flow

1. **Landing Page**: Browse features and platform benefits
2. **Registration**: Click "Get Started" → Select role → Fill registration form
3. **Login**: Enter credentials and select matching role
4. **Dashboard**: Redirected to role-specific homepage

### Farmer Workflow

1. **Dashboard**: View personalized recommendations and quick actions
2. **Rent Equipment**: 
   - Browse available equipment
   - Check distance and pricing
   - Book instantly
3. **Hire Labor**: 
   - Filter by skill
   - Review worker profiles
   - Contact directly
4. **Check Weather**: 
   - View 5-day forecast
   - Plan farming activities
5. **Market Prices**: 
   - Compare commodity prices
   - Identify best selling opportunities

### Seller Workflow

1. **Dashboard**: Monitor sales, bookings, and messages
2. **Manage Listings**: Add/edit equipment and inputs
3. **Handle Bookings**: Accept/reject farmer requests
4. **Communicate**: Respond to farmer inquiries
5. **Analytics**: Track weekly performance trends

---

## User Roles

### Farmer (Primary User)
- **Goal**: Access modern equipment, labor, and agricultural intelligence
- **Pain Points**: High equipment costs, unreliable labor, market information asymmetry
- **Value Proposition**: Affordable access to resources that increase productivity

### Seller (Equipment Owners)
- **Goal**: Monetize idle agricultural equipment and inputs
- **Pain Points**: Finding customers, managing bookings, pricing optimization
- **Value Proposition**: Direct access to farmer network with built-in trust

### Laborer (Farm Workers)
- **Goal**: Find consistent work opportunities with fair wages
- **Pain Points**: Seasonal unemployment, lack of job visibility, wage disputes
- **Value Proposition**: Verified job marketplace with transparent pricing

---

## Key Functionalities

### 1. Location-Based Services
- **Geolocation API**: Detects user's current location
- **Nominatim Reverse Geocoding**: Converts coordinates to city/state names
- **Distance Calculation**: Shows equipment availability by proximity

### 2. Multi-Language Support
- **8 Languages**: Full UI translation for major Indian languages
- **Context-Based**: React Context API for global state management
- **Persistent**: Language preference saved in localStorage

### 3. Real-Time Weather Integration
- **OpenWeatherMap API**: Current conditions and 5-day forecasts
- **Fallback Mechanism**: Mock data when API unavailable
- **Location-Aware**: Weather for user's current city

### 4. Local Data Persistence
- **User Authentication**: Stored in localStorage
- **Session Management**: Active user in sessionStorage
- **Profile Pictures**: Base64-encoded images in localStorage

### 5. Responsive Design
- **Mobile-First**: Optimized for smartphone screens
- **Tailwind CSS**: Utility-first responsive classes
- **Touch-Friendly**: Large tap targets and horizontal scrolling

---

## Multi-Language Support

### Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| `en` | English | English |
| `hi` | Hindi | हिंदी |
| `mr` | Marathi | मराठी |
| `ta` | Tamil | தமிழ் |
| `te` | Telugu | తెలుగు |
| `kn` | Kannada | ಕನ್ನಡ |
| `gu` | Gujarati | ગુજરાતી |
| `bn` | Bengali | বাংলা |

### Implementation Details

**Translation Structure**:
```typescript
const translations = {
  welcome: {
    en: 'Welcome',
    hi: 'स्वागत है',
    mr: 'स्वागत आहे',
    // ... other languages
  }
};
```

**Usage in Components**:
```typescript
const { t } = useLanguage();
return <h1>{t('welcome')}</h1>;
```

**Language Selector**: Available in header of all authenticated pages

---

## Future Enhancements

### Phase 1 (MVP Improvements)
- [ ] Backend API integration (Node.js/Express or Firebase)
- [ ] Real database (PostgreSQL/MongoDB)
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] SMS/Email notifications
- [ ] GPS-based live tracking

### Phase 2 (Advanced Features)
- [ ] AI-powered crop recommendation system
- [ ] Soil health analysis via image recognition
- [ ] Peer-to-peer farmer community forum
- [ ] Government scheme integration
- [ ] Insurance and loan calculator

### Phase 3 (Scale & Expansion)
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync
- [ ] Voice assistant in regional languages
- [ ] Blockchain-based supply chain tracking
- [ ] Drone/IoT sensor integration

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Contact & Support

- **Project Repository**: [GitHub Link]
- **Documentation**: [Wiki Link]
- **Issues**: [Issue Tracker]
- **Email**: support@krushisathi.in

---

## Acknowledgments

- **Images**: Unsplash, Picsum Photos
- **Icons**: Custom SVG components
- **Weather Data**: OpenWeatherMap API
- **Mapping**: OpenStreetMap (Nominatim)
- **Inspiration**: Indian agricultural community and their challenges

---

**Built with ❤️ for Indian Farmers**