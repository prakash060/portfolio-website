# Portfolio Website - FoodHub Application

A comprehensive portfolio project showcasing a modern food delivery web application with real-time UPI payments, built using React and Material-UI, with a complete Node.js backend API.

## 🏗️ **Project Structure**

```
portfolio-website/
├── portfolio-client/        # Frontend React application
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   ├── package.json        # Dependencies
│   └── README.md           # Client setup guide
├── portfolio-server/        # 🆕 Backend Node.js API
│   ├── config/             # Configuration files
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API route handlers
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   └── README.md           # Server setup guide
├── .git/                   # Git repository
├── .gitignore             # Git ignore rules
├── node_modules/          # Dependencies (root level)
└── README.md              # This file
```

## 🚀 **What's Inside**

### **portfolio-client/**
The main React application featuring:
- **Modern Food Delivery UI** - Professional Material-UI design
- **User Authentication** - Complete signup/signin system
- **Shopping Experience** - Food catalog, cart, and checkout
- **Real-time UPI Payments** - Integrated with Razorpay gateway
- **Order Management** - Track orders and delivery status
- **Responsive Design** - Works on all devices

### **portfolio-server/** 🆕
A production-ready Node.js backend API featuring:
- **RESTful API Design** - Professional API architecture
- **User Authentication** - JWT-based secure authentication
- **Database Management** - MongoDB with Mongoose ODM
- **Payment Processing** - Complete Razorpay integration
- **Order Management** - Full order lifecycle handling
- **Admin Dashboard** - Comprehensive admin controls
- **Security Features** - Helmet, CORS, input validation
- **Webhook Support** - Real-time payment updates

## 🛠️ **Technology Stack**

### **Frontend (portfolio-client)**
- **Frontend Framework**: React 18 + Material-UI v5
- **State Management**: React Context API
- **Routing**: React Router v6
- **Payment**: Razorpay UPI integration
- **Styling**: CSS-in-JS with MUI System
- **Build Tool**: Create React App

### **Backend (portfolio-server)** 🆕
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Payment Gateway**: Razorpay
- **Security**: Helmet, CORS, input validation
- **Logging**: Morgan HTTP logger

## 📦 **Quick Start**

### **Frontend Development**
```bash
cd portfolio-client
npm install
npm start
```

### **Backend Development** 🆕
```bash
cd portfolio-server
npm install
cp env.example .env
# Update .env with your configuration
npm run dev
```

The applications will open at:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`

## 🎯 **Portfolio Highlights**

This project demonstrates your expertise in:

### **Full-Stack Development** 🆕
- **Frontend**: Modern React patterns and hooks
- **Backend**: Professional Node.js API design
- **Database**: MongoDB schema design and management
- **Integration**: Seamless frontend-backend communication

### **Payment Integration**
- Real-time UPI payment processing
- Payment gateway integration (Razorpay)
- Secure payment verification
- Webhook handling for real-time updates

### **User Experience**
- Intuitive navigation and workflows
- Professional UI/UX design
- Mobile-first responsive design
- Accessibility considerations

### **Technical Skills**
- API design and development
- Database modeling and optimization
- Security best practices
- Performance optimization

## 🔧 **Development Commands**

### **Frontend (portfolio-client)**
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

### **Backend (portfolio-server)** 🆕
```bash
npm start          # Start production server
npm run dev        # Start development server
npm test           # Run test suite
npm run seed       # Seed database (to be implemented)
```

## 📱 **Features Overview**

- ✅ **Authentication System** - User registration and login
- ✅ **Food Catalog** - Browse and search food items
- ✅ **Shopping Cart** - Add/remove items and manage quantities
- ✅ **Checkout Process** - Multi-step order placement
- ✅ **UPI Payments** - Real-time payment via Razorpay
- ✅ **Order Tracking** - View order history and status
- ✅ **User Profiles** - Manage account information
- ✅ **Admin Dashboard** - Complete admin controls 🆕
- ✅ **API Management** - RESTful backend services 🆕
- ✅ **Database Design** - MongoDB with Mongoose 🆕
- ✅ **Security Features** - JWT, CORS, input validation 🆕

## 🌐 **Application Routes**

### **Frontend Routes**
- `/` - Home page with food showcase
- `/signup` - User registration
- `/signin` - User login
- `/profile` - User profile management
- `/food-catalog` - Browse food items
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/orders` - Order history
- `/order-confirmation/:id` - Order confirmation

### **Backend API Routes** 🆕
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/foods/*` - Food catalog management
- `/api/orders/*` - Order processing
- `/api/payments/*` - Payment processing

## 💳 **Payment Features**

### **UPI Integration**
- Real-time payment processing
- Multiple UPI app support
- Payment verification
- Error handling and retry

### **Payment Methods**
- **UPI**: Instant digital payments
- **Credit/Debit Card**: Secure card processing
- **Cash on Delivery**: Traditional payment option

## 🔒 **Security Features**

- Protected routes for authenticated users
- Payment signature verification
- Input validation and sanitization
- Secure session management
- JWT token authentication 🆕
- CORS protection 🆕
- Helmet security headers 🆕

## 📚 **Documentation**

- **portfolio-client/README.md** - Detailed client setup guide
- **portfolio-server/README.md** - 🆕 Complete server setup guide
- **portfolio-client/RAZORPAY_SETUP.md** - Payment integration guide
- **Inline Code Comments** - Comprehensive code documentation

## 🚀 **Deployment**

### **Frontend Deployment**
```bash
cd portfolio-client
npm run build
```

### **Backend Deployment** 🆕
```bash
cd portfolio-server
npm start
# Or use PM2 for production
pm2 start server.js --name "portfolio-server"
```

### **Deploy Options**
- **Netlify**: Frontend deployment
- **Vercel**: Full-stack deployment
- **AWS**: EC2 for backend, S3 for frontend
- **Heroku**: Full-stack deployment
- **DigitalOcean**: Droplet deployment

## 🧪 **Testing**

### **Test Scenarios**
- User authentication flows
- Shopping cart operations
- Payment processing
- API endpoint testing 🆕
- Database operations 🆕
- Responsive design
- Cross-browser compatibility

### **Test Data**
- Sample food items with images
- Mock user accounts
- Test UPI IDs for payment testing

## 📁 **Project Organization**

The project is organized into logical sections:

- **portfolio-client**: Complete React frontend application
- **portfolio-server**: 🆕 Complete Node.js backend API
- **Components**: Reusable UI components
- **Context**: State management and data providers
- **Models**: Database schemas and methods 🆕
- **Routes**: API endpoint handlers 🆕
- **Middleware**: Authentication and error handling 🆕
- **Configuration**: Environment and service configs 🆕

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 **Support & Issues**

- Check the detailed README files in each project folder
- Review inline code comments
- Refer to RAZORPAY_SETUP.md for payment issues
- Report bugs via GitHub issues

## 📄 **License**

This project is for portfolio demonstration purposes.

---

## 🎯 **Ready to Showcase!**

Your FoodHub application demonstrates:
- **Full-stack thinking** with complete frontend and backend
- **Modern development practices** and best practices
- **Real-world integration** with payment gateways and databases
- **Professional UI/UX** design skills
- **Comprehensive documentation** and setup guides
- **Production-ready architecture** with security and scalability 🆕

**🚀 Perfect for showcasing your complete full-stack development expertise!**
