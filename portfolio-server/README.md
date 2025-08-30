# Portfolio Server - FoodHub Backend API

A robust, production-ready Node.js backend API for the FoodHub portfolio application, featuring real-time UPI payments via Razorpay, comprehensive user management, and advanced order processing.

## 🚀 **Features**

### **Core API Functionality**
- ✅ **User Authentication** - JWT-based secure authentication
- ✅ **User Management** - Complete user CRUD operations
- ✅ **Food Catalog** - Advanced food item management with search and filtering
- ✅ **Order Processing** - Complete order lifecycle management
- ✅ **Real-time Payments** - Razorpay UPI integration with webhook support
- ✅ **Admin Dashboard** - Comprehensive admin controls and analytics

### **Advanced Features**
- 🔐 **Security** - Helmet, CORS, rate limiting, input validation
- 📊 **Analytics** - User statistics, order analytics, revenue tracking
- 🔄 **Webhooks** - Real-time payment status updates
- 📱 **Responsive API** - RESTful endpoints with proper error handling
- 🗄️ **Database** - Microsoft SQL Server (MSSQL) with Sequelize ORM
- 📝 **Logging** - Morgan HTTP request logging

## 🏗️ **Project Structure**

```
portfolio-server/
├── config/                 # Configuration files
│   └── database.js        # MSSQL Database connection (Sequelize)
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication & authorization
│   └── errorHandler.js   # Global error handling
├── models/               # Sequelize data models
│   ├── User.js          # User schema and methods
│   ├── Food.js          # Food item schema
│   ├── Order.js         # Order management schema
│   ├── Review.js        # Food review schema
│   └── index.js         # Model associations
├── routes/               # API route handlers
│   ├── auth.js          # Authentication routes
│   ├── users.js         # User management routes
│   ├── foods.js         # Food catalog routes
│   ├── orders.js        # Order management routes
│   └── payments.js      # Payment processing routes
├── scripts/              # Database setup scripts
│   └── setup-db.js      # Database initialization script
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
├── .sequelizerc          # Sequelize CLI configuration
├── env.example           # Environment variables template
└── README.md             # This file
```

## 🛠️ **Technology Stack**

- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18+
- **Database**: Microsoft SQL Server (MSSQL) with Sequelize ORM
- **Authentication**: JWT with bcryptjs
- **Payment Gateway**: Razorpay
- **Security**: Helmet, CORS, input validation
- **Logging**: Morgan HTTP logger
- **Development**: Nodemon for auto-restart

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js (v16 or higher)
- Microsoft SQL Server (2016+) or SQL Server Express
- Razorpay account (for payment processing)

### **1. Clone and Install**
```bash
cd portfolio-server
npm install
```

### **2. Environment Configuration**
Copy `env.example` to `.env` and update values:
```bash
cp env.example .env
```

Update `.env` with your MSSQL database configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MSSQL)
DB_HOST=localhost
DB_PORT=1433
DB_NAME=portfolio_foodhub
DB_DIALECT=mssql

# Authentication Method
# Set to 'true' for Windows Authentication, 'false' for SQL Server Authentication
DB_USE_WINDOWS_AUTH=true

# SQL Server Authentication (only needed if DB_USE_WINDOWS_AUTH=false)
DB_USER=sa
DB_PASSWORD=your_password_here

# Alternative MySQL Configuration
# DB_DIALECT=mysql
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=portfolio_foodhub
# DB_USER=root
# DB_PASSWORD=your_password_here

# Alternative PostgreSQL Configuration
# DB_DIALECT=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=portfolio_foodhub
# DB_USER=postgres
# DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

### **3. Database Setup**

#### **Option A: Automatic Setup (Recommended)**
```bash
npm run db:setup
```

#### **Option B: Manual Setup**
1. Create a MSSQL database named `portfolio_foodhub`
2. Ensure your database user has proper privileges

### **4. Database Migration & Seeding**
```bash
# Create database tables
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### **5. Start Development Server**
```bash
npm run dev
```

The server will start at `http://localhost:5000`

## 🔧 **Available Scripts**

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite (to be implemented)
- `npm run seed` - Seed database with sample data (to be implemented)
- `npm run db:setup` - Initialize MSSQL database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (drop, create, migrate, seed)

## 🗄️ **Database Models**

### **User Model**
- Authentication fields (email, password)
- Profile information (name, phone, address)
- Role-based access control
- Account status management

### **Food Model**
- Food details (name, description, price)
- Category and dietary information
- Stock management
- Rating and review system

### **Order Model**
- Order items and quantities
- Delivery details and instructions
- Payment information and status
- Order lifecycle tracking

### **Review Model**
- User reviews for food items
- Rating and comment system
- One review per user per food item

## 🔐 **Authentication & Authorization**

### **JWT Token Usage**
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### **Protected Routes**
Most routes require authentication. Use the `protect` middleware.

### **Admin Routes**
Admin-only routes use the `admin` middleware to check user role.

## 💳 **Payment Integration**

### **Razorpay Setup**
1. **Get Credentials**: Sign up at [razorpay.com](https://razorpay.com)
2. **Update Environment**: Set your Razorpay keys in `.env`
3. **Webhook Configuration**: Configure webhook URL in Razorpay dashboard

### **Payment Flow**
1. **Create Order**: Frontend calls `/api/payments/create-order`
2. **Payment Processing**: User completes payment via Razorpay
3. **Verification**: Frontend calls `/api/payments/verify`
4. **Webhook Updates**: Real-time status updates via webhooks

### **Supported Payment Methods**
- UPI (Google Pay, PhonePe, Paytm)
- Credit/Debit Cards
- Net Banking
- Digital Wallets
- Cash on Delivery

## 🔒 **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: HTTP security headers
- **Rate Limiting**: API request rate limiting
- **SQL Injection Protection**: Sequelize ORM protection

## 📊 **Analytics & Monitoring**

### **User Analytics**
- Total users and growth metrics
- Active vs inactive users
- Role distribution

### **Order Analytics**
- Order status distribution
- Revenue tracking
- Delivery performance metrics

### **Food Analytics**
- Category distribution
- Popular items tracking
- Stock level monitoring

## 🚀 **Deployment**

### **Environment Variables**
Ensure all required environment variables are set in production.

### **Database**
Use a production SQL database service (AWS RDS, Google Cloud SQL, etc.).

### **Process Management**
Use PM2 or similar process manager:
```bash
npm install -g pm2
pm2 start server.js --name "portfolio-server"
```

### **Reverse Proxy**
Use Nginx or Apache as reverse proxy for production.

## 🧪 **Testing**

### **API Testing**
Use Postman or similar tools to test endpoints.

### **Test Data**
Create test users and food items for development.

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Database Connection Failed**
- Check SQL database service status
- Verify connection details in `.env`
- Ensure network access and firewall settings
- Verify database user privileges

#### **JWT Token Invalid**
- Check token expiration
- Verify JWT_SECRET in `.env`
- Ensure proper token format

#### **Razorpay Integration Issues**
- Verify API keys in `.env`
- Check webhook configuration
- Ensure proper signature verification

#### **Database Migration Issues**
- Ensure database exists and is accessible
- Check user permissions
- Verify Sequelize configuration

## 📚 **API Documentation**

### **Request/Response Format**
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

### **Error Handling**
Errors return appropriate HTTP status codes with error details:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Additional error details (development only)"
}
```

### **Pagination**
List endpoints support pagination:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 **Support**

- **Documentation**: Check inline code comments
- **Issues**: Report bugs via GitHub issues
- **API Reference**: Use the endpoints documentation above

## 📄 **License**

This project is for portfolio demonstration purposes.

---

## 🎯 **Ready for Production!**

Your backend API demonstrates:
- **Professional API Design** with RESTful principles
- **Security Best Practices** with JWT and input validation
- **Payment Gateway Integration** with Razorpay
- **Database Design** with MSSQL and Sequelize ORM
- **Error Handling** with comprehensive error management
- **Documentation** with detailed API specifications

**🚀 Perfect for showcasing your full-stack development expertise!**

## 🎯 **MSSQL Requirements!**
 MSSQL Requirements
SQL Server: 2016 or higher
SQL Server Express: Free version available
Port: 1433 (default)
Authentication: SQL Server Authentication or Windows Authentication
Browser Service: Must be running for dynamic port discovery
📚 Available Commands
npm run dev - Start development server
npm run db:test - Test MSSQL connection
npm run db:setup - Initialize MSSQL database
npm run db:migrate - Run database migrations
npm run db:seed - Seed sample data
npm run db:reset - Reset entire database
