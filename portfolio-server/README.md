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
- 🗄️ **Database** - MongoDB with Mongoose ODM
- 📝 **Logging** - Morgan HTTP request logging

## 🏗️ **Project Structure**

```
portfolio-server/
├── config/                 # Configuration files
│   ├── database.js        # MongoDB connection
│   └── razorpay.js        # Razorpay payment gateway config
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication & authorization
│   └── errorHandler.js   # Global error handling
├── models/               # Mongoose data models
│   ├── User.js          # User schema and methods
│   ├── Food.js          # Food item schema
│   └── Order.js         # Order management schema
├── routes/               # API route handlers
│   ├── auth.js          # Authentication routes
│   ├── users.js         # User management routes
│   ├── foods.js         # Food catalog routes
│   ├── orders.js        # Order management routes
│   └── payments.js      # Payment processing routes
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
├── env.example           # Environment variables template
└── README.md             # This file
```

## 🛠️ **Technology Stack**

- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Payment Gateway**: Razorpay
- **Security**: Helmet, CORS, input validation
- **Logging**: Morgan HTTP logger
- **Development**: Nodemon for auto-restart

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
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

Update `.env` with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio-foodhub

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

### **3. Database Setup**
Ensure MongoDB is running and accessible at your configured URI.

### **4. Start Development Server**
```bash
npm run dev
```

The server will start at `http://localhost:5000`

## 🔧 **Available Scripts**

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite (to be implemented)
- `npm run seed` - Seed database with sample data (to be implemented)

## 🌐 **API Endpoints**

### **Authentication Routes**
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
GET    /api/auth/me                # Get current user profile
PUT    /api/auth/update-profile    # Update user profile
PUT    /api/auth/change-password   # Change password
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
POST   /api/auth/logout            # User logout
POST   /api/auth/refresh           # Refresh JWT token
```

### **User Management Routes**
```
GET    /api/users                  # Get all users (Admin)
GET    /api/users/:id              # Get user by ID
PUT    /api/users/:id              # Update user
DELETE /api/users/:id              # Delete user (Admin)
PUT    /api/users/:id/deactivate   # Deactivate user (Admin)
PUT    /api/users/:id/activate     # Activate user (Admin)
GET    /api/users/stats/overview   # User statistics (Admin)
GET    /api/users/search           # Search users (Admin)
```

### **Food Catalog Routes**
```
GET    /api/foods                  # Get all foods with filtering
GET    /api/foods/:id              # Get food by ID
GET    /api/foods/categories/list  # Get food categories
GET    /api/foods/featured/list    # Get featured foods
GET    /api/foods/sale/list        # Get foods on sale
GET    /api/foods/search/query     # Search foods
POST   /api/foods/:id/reviews      # Add food review
GET    /api/foods/:id/reviews      # Get food reviews
GET    /api/foods/stats/overview   # Food statistics (Admin)
POST   /api/foods                  # Create food (Admin)
PUT    /api/foods/:id              # Update food (Admin)
DELETE /api/foods/:id              # Delete food (Admin)
```

### **Order Management Routes**
```
POST   /api/orders                 # Create new order
GET    /api/orders/my-orders       # Get user orders
GET    /api/orders/:id             # Get order by ID
PUT    /api/orders/:id/status      # Update order status (Admin)
PUT    /api/orders/:id/cancel      # Cancel order
GET    /api/orders                 # Get all orders (Admin)
GET    /api/orders/stats/overview  # Order statistics (Admin)
GET    /api/orders/pending-payments # Pending payment orders (Admin)
GET    /api/orders/delayed         # Delayed orders (Admin)
PUT    /api/orders/:id/refund      # Process refund (Admin)
POST   /api/orders/:id/calculate-delivery # Calculate delivery time (Admin)
```

### **Payment Processing Routes**
```
POST   /api/payments/create-order  # Create Razorpay order
POST   /api/payments/verify        # Verify payment signature
GET    /api/payments/status/:id    # Get payment status
POST   /api/payments/capture/:id   # Capture payment
POST   /api/payments/refund/:id    # Process refund
POST   /api/payments/webhook       # Razorpay webhook handler
GET    /api/payments/methods       # Get available payment methods
```

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

## 🔒 **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: HTTP security headers
- **Rate Limiting**: API request rate limiting
- **SQL Injection Protection**: Mongoose ODM protection

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
Use MongoDB Atlas or other cloud MongoDB service for production.

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

#### **MongoDB Connection Failed**
- Check MongoDB service status
- Verify connection string in `.env`
- Ensure network access

#### **JWT Token Invalid**
- Check token expiration
- Verify JWT_SECRET in `.env`
- Ensure proper token format

#### **Razorpay Integration Issues**
- Verify API keys in `.env`
- Check webhook configuration
- Ensure proper signature verification

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
- **Database Design** with MongoDB and Mongoose
- **Error Handling** with comprehensive error management
- **Documentation** with detailed API specifications

**🚀 Perfect for showcasing your full-stack development expertise!**
