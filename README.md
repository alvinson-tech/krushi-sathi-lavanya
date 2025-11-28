# Krushi Sathi - Agricultural Platform

A comprehensive agricultural platform connecting farmers, sellers, and labourers with features like equipment rental, labour hiring, weather forecasts, and market prices.

## Features

- 🌾 **Multi-role System** - Separate interfaces for Farmers, Sellers, and Labourers
- 🔐 **User Authentication** - Secure registration and login
- 💾 **SQLite Database** - Persistent data storage
- 🗄️ **Admin Dashboard** - View and manage all database records
- 🌐 **Bilingual Support** - English and Kannada language options
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

### Frontend
- React 19.2.0
- TypeScript
- React Router DOM
- Vite (Build tool)

### Backend
- Node.js
- Express.js
- SQLite (via sql.js)
- CORS enabled

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd krushi-sathi
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages for both frontend and backend.

### 3. Start the Application

```bash
npm run dev
```

This single command starts both servers:
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000

### 4. Access the Application

- **Main Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/#/admin/database
  - Username: `admin`
  - Password: `admin123`

## Project Structure

```
krushi-sathi/
├── server/                  # Backend server
│   ├── server.js           # Express server entry point
│   ├── database.js         # SQLite database configuration
│   ├── routes/             # API routes
│   │   ├── users.js        # User authentication routes
│   │   └── admin.js        # Admin routes
│   └── krushi-sathi.db     # SQLite database (auto-generated)
├── pages/                   # React pages/components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegistrationPage.tsx
│   ├── DatabaseViewerPage.tsx
│   ├── farmer/             # Farmer-specific pages
│   ├── seller/             # Seller-specific pages
│   └── labourer/           # Labourer-specific pages
├── services/
│   └── db.ts               # Frontend API service
├── contexts/
│   └── LanguageContext.tsx # Language switching context
├── App.tsx                 # Main app component
├── index.tsx               # App entry point
└── package.json            # Dependencies and scripts

```

## Available Scripts

- **`npm run dev`** - Start both frontend and backend servers (recommended)
- **`npm run server`** - Start only the backend server
- **`npm run client`** - Start only the frontend server
- **`npm run build`** - Build for production

## Database

### Automatic Setup
The SQLite database is automatically created on first run with the following tables:
- `users` - User accounts (farmers, sellers, labourers)
- `equipment` - Equipment listings (for future features)
- `labour_requests` - Labour hiring requests (for future features)
- `market_prices` - Crop market prices (for future features)
- `admin_users` - Admin credentials

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ **Security Note**: Change the default admin password in production!

### Database Location
The database file is created at: `server/krushi-sathi.db`

## API Endpoints

### User Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/records` - Get all database records
- `POST /api/admin/delete` - Delete a record

### Health Check
- `GET /api/health` - Check if API is running

## Setting Up on a New Machine

### Step-by-Step Guide

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd krushi-sathi
   ```

2. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Verify installation: `node --version`

3. **Install project dependencies**
   ```bash
   npm install
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to http://localhost:3000

### First-Time Setup Notes

- The database will be automatically created on first run
- No additional configuration needed
- All dependencies are installed via `npm install`
- The default admin account is pre-configured

## Troubleshooting

### Port Already in Use

If you see an error about ports 3000 or 3001 being in use:

**Option 1**: Kill the process using the port
```bash
# On Mac/Linux
lsof -ti:3000 | xargs kill
lsof -ti:3001 | xargs kill

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Option 2**: Change the port in the code
- Backend: Edit `server/server.js` (line with `const PORT = 3001`)
- Frontend: Vite will automatically try the next available port

### Database Issues

If you encounter database errors:
1. Delete `server/krushi-sathi.db`
2. Restart the server - it will recreate the database

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

Ensure both servers are running:
- Backend on port 3001
- Frontend on port 3000

## Development

### Adding New Features

1. **Backend**: Add routes in `server/routes/`
2. **Frontend**: Add pages in `pages/`
3. **Database**: Modify schema in `server/database.js`

### Code Style

- TypeScript for frontend
- ES6+ JavaScript for backend
- Functional React components

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Environment Variables

For production, create a `.env` file:
```env
PORT=3001
NODE_ENV=production
```

### Security Checklist

- [ ] Change default admin password
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement proper password hashing (currently plain text)
- [ ] Add input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact the development team

## Acknowledgments

- Built with React and Express
- SQLite for lightweight database
- Vite for fast development experience

---

**Happy Farming! 🌾**