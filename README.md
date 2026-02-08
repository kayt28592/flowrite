# 🚀 Flowrite - Full-Stack Form Builder Application

A professional full-stack web application for **Flowrite Concrete Recycling & Materials** company to manage form submissions, customers, and docket generation.

![Tech Stack](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/Database-SQLite-blue)

---

## 📋 Features

### ✅ Core Functionality
- **User Authentication** - JWT-based login/register system
- **Customer Management** - Add, edit, delete customers with contact info
- **Form Submissions** - Digital signature, date/time tracking
- **Docket Generation** - Professional PDF-ready dockets with filtering
- **Items Management** - Manage products/services catalog
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🔐 Security
- Password hashing with bcrypt
- JWT token authentication
- Secure API endpoints
- Input validation & sanitization

### 🗄️ Database
- SQLite for reliable local storage
- Automatic schema initialization
- Data integrity with foreign keys
- Indexed queries for performance

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern responsive design
- **Vanilla JavaScript** - No frameworks, pure JS
- **Fetch API** - RESTful API communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** (better-sqlite3) - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **Morgan** - HTTP logging

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd flowrite-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment (optional)**
Edit `.env` file if needed:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
```

4. **Start the server**
```bash
npm start
```

5. **Open your browser**
Navigate to: http://localhost:3000

---

## 🚀 Usage

### First Time Setup

1. **Register an account**
   - Click "Register" tab
   - Enter your email and password (min 6 characters)
   - Click "Create Account"

2. **Login**
   - Use your registered email and password
   - Click "Login"

3. **Add Customers**
   - Go to "Customers" tab
   - Click "Add New Customer"
   - Fill in customer details

4. **Add Items**
   - Go to "Items" tab
   - Click "Add New Item"
   - Add products/services

5. **Fill Forms**
   - Go to "Fill Form" tab
   - Select customer and item
   - Add signature
   - Submit

6. **Generate Dockets**
   - Go to "Submissions" tab
   - Click "Create Docket"
   - Select customer and date range
   - Print or save PDF

---

## 📁 Project Structure

```
flowrite-app/
├── frontend/                 # Frontend files
│   ├── css/
│   │   └── styles.css       # All styles
│   ├── js/
│   │   ├── config.js        # API configuration
│   │   ├── api.js           # HTTP client
│   │   ├── auth.js          # Authentication
│   │   ├── app.js           # Main app logic
│   │   ├── customers.js     # Customer management
│   │   ├── submissions.js   # Submission management
│   │   └── items.js         # Items management
│   └── index.html           # Main HTML file
│
├── backend/                  # Backend files
│   ├── controllers/         # Route handlers
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   └── submissionController.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT verification
│   │   └── errorHandler.js  # Error handling
│   ├── models/              # Database models
│   │   ├── db.js            # Database connection
│   │   ├── schema.js        # Table schemas
│   │   ├── User.js
│   │   ├── Customer.js
│   │   └── Submission.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── customers.js
│   │   └── submissions.js
│   ├── data/                # Database storage
│   │   └── flowrite.db      # SQLite database (auto-created)
│   └── server.js            # Main server file
│
├── package.json             # Dependencies
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (requires auth)
```

### Customers
```
GET    /api/customers        - Get all customers
GET    /api/customers/:id    - Get single customer
POST   /api/customers        - Create customer
PUT    /api/customers/:id    - Update customer
DELETE /api/customers/:id    - Delete customer
GET    /api/customers/search?q=term  - Search customers
```

### Submissions
```
GET    /api/submissions      - Get all submissions
GET    /api/submissions/:id  - Get single submission
POST   /api/submissions      - Create submission
PUT    /api/submissions/:id  - Update submission
DELETE /api/submissions/:id  - Delete submission
GET    /api/submissions/customer/:name  - Get by customer
GET    /api/submissions/date-range?startDate=X&endDate=Y  - Get by date
GET    /api/submissions/stats  - Get statistics
```

---

## 🌐 Deployment

### Deploy to GitHub

1. **Initialize Git repository**
```bash
git init
git add .
git commit -m "Initial commit: Flowrite full-stack app"
```

2. **Create GitHub repository**
- Go to github.com
- Click "New Repository"
- Name it `flowrite-app`
- Don't initialize with README

3. **Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/flowrite-app.git
git branch -M main
git push -u origin main
```

### Deploy to Cloud Platforms

#### Render.com (Recommended - Free tier available)

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: flowrite-app
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variable:
   - `JWT_SECRET`: (generate a random string)
6. Click "Create Web Service"

#### Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create flowrite-app`
4. Set env vars: `heroku config:set JWT_SECRET=your-secret-key`
5. Deploy: `git push heroku main`

#### Railway.app

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables
5. Deploy automatically

---

## 🔐 Security Best Practices

### Before Production:

1. **Change JWT Secret**
   - Generate strong random string
   - Update `.env` file
   - Never commit real secrets to Git

2. **Use HTTPS**
   - Always use HTTPS in production
   - Update CORS_ORIGIN in `.env`

3. **Set Strong Passwords**
   - Enforce minimum 8+ characters
   - Add password complexity rules

4. **Rate Limiting**
   - Add rate limiting middleware
   - Prevent brute force attacks

5. **Input Validation**
   - Already implemented with express-validator
   - Review validation rules

---

## 🐛 Troubleshooting

### Database Issues
```bash
# Delete and recreate database
rm backend/data/flowrite.db
npm start
```

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Authentication Errors
```bash
# Clear browser localStorage
# Open DevTools → Application → Local Storage → Clear All
```

---

## 📝 Development

### Run in Development Mode
```bash
npm run dev
```

This uses nodemon for auto-restart on file changes.

### Database Schema

**Users Table**
```sql
id, email, password, created_at
```

**Customers Table**
```sql
id, user_id, name, email, phone, address, created_at, updated_at
```

**Submissions Table**
```sql
id, user_id, customer_name, date, time, address, 
order_details, amount, rego, signature_image, created_at
```

---

## 📄 License

MIT License - Free to use and modify

---

## 👨‍💻 Author

Built with ❤️ for Flowrite Concrete Recycling & Materials

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@flowrite.com (replace with actual email)

---

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Export to Excel/CSV
- [ ] Advanced search/filtering
- [ ] User roles & permissions
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)
- [ ] File attachments
- [ ] Analytics dashboard

---

**Happy Building! 🚀**
