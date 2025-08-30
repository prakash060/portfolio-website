# Portfolio Client - FoodHub Application

A modern, responsive food delivery web application built with React and Material-UI, featuring real-time UPI payments via Razorpay.

## 🚀 **Features**

### **Core Functionality**
- ✅ **User Authentication** - Sign up, sign in, and profile management
- ✅ **Food Catalog** - Browse and search food items
- ✅ **Shopping Cart** - Add, remove, and manage cart items
- ✅ **Order Management** - Place orders and track delivery status
- ✅ **Real-time UPI Payments** - Integrated with Razorpay payment gateway

### **Advanced Features**
- 🔐 **Protected Routes** - Secure access to authenticated features
- 💳 **Multiple Payment Methods** - UPI, Credit/Debit Card, Cash on Delivery
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI/UX** - Material-UI components with custom theming
- 🔒 **Payment Security** - Secure payment processing and verification

## 🏗️ **Project Structure**

```
portfolio-client/
├── public/                 # Static assets and HTML template
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── Header.js      # Navigation and user profile
│   │   ├── Home.js        # Landing page
│   │   ├── FoodCatalog.js # Food items display
│   │   ├── CartPage.js    # Shopping cart
│   │   ├── CheckoutPage.js # Order checkout
│   │   ├── UpiPayment.js  # UPI payment integration
│   │   ├── OrderHistory.js # Order tracking
│   │   ├── ProfileDetails.js # User profile
│   │   └── ...            # Other components
│   ├── context/           # React Context providers
│   │   ├── AuthContext.js # User authentication
│   │   ├── CartContext.js # Shopping cart state
│   │   ├── OrderContext.js # Order management
│   │   └── PaymentContext.js # Payment processing
│   ├── data/              # Static data and mock APIs
│   │   └── foodData.js    # Food items data
│   ├── config/            # Configuration files
│   │   └── razorpay.js    # Razorpay payment settings
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions
└── RAZORPAY_SETUP.md     # Payment integration guide
```

## 🛠️ **Technology Stack**

- **Frontend Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context API
- **Routing**: React Router v6
- **Payment Gateway**: Razorpay
- **Styling**: CSS-in-JS with MUI System
- **Build Tool**: Create React App

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn package manager

### **1. Install Dependencies**
```bash
cd portfolio-client
npm install
```

### **2. Configure Razorpay (Optional)**
For real UPI payments, update `src/config/razorpay.js`:
```javascript
export const RAZORPAY_CONFIG = {
  key: 'rzp_test_YOUR_ACTUAL_KEY_HERE',
  // ... other settings
};
```

### **3. Start Development Server**
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🔧 **Available Scripts**

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

## 🌐 **Application Routes**

- `/` - Home page with food showcase
- `/signup` - User registration
- `/signin` - User login
- `/profile` - User profile details
- `/food-catalog` - Browse food items
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/orders` - Order history
- `/order-confirmation/:id` - Order confirmation

## 💳 **Payment Integration**

### **UPI Payment Flow**
1. User selects UPI payment method
2. Enters UPI ID (e.g., username@okicici)
3. Razorpay payment modal opens
4. User completes payment in UPI app
5. Payment verification and order confirmation

### **Supported Payment Methods**
- **UPI**: Real-time payment via Razorpay
- **Credit/Debit Card**: Secure card processing
- **Cash on Delivery**: Pay when food arrives

## 🔒 **Security Features**

- **Protected Routes**: Authentication required for sensitive pages
- **Payment Verification**: Signature validation for UPI payments
- **Secure Storage**: Local storage for user sessions
- **Input Validation**: Form validation and sanitization

## 📱 **Responsive Design**

- **Desktop**: Full-featured interface with sidebars
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly mobile-first design
- **Cross-browser**: Compatible with modern browsers

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
```

### **Deploy Options**
- **Netlify**: Drag and drop `build` folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload `build` folder
- **Custom Server**: Serve static files

## 🧪 **Testing**

### **Test Scenarios**
- User registration and authentication
- Food browsing and cart management
- Order placement and payment
- UPI payment flow (test mode)
- Responsive design across devices

### **Test Data**
- Test UPI IDs: `success@razorpay`, `failure@razorpay`
- Sample food items with images and descriptions
- Mock user accounts for testing

## 📚 **Documentation**

- **RAZORPAY_SETUP.md**: Complete payment integration guide
- **Code Comments**: Inline documentation for complex logic
- **Component Props**: TypeScript-like prop documentation

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 **Support**

- **Documentation**: Check inline code comments
- **Issues**: Report bugs via GitHub issues
- **Payment Issues**: Refer to RAZORPAY_SETUP.md

## 📄 **License**

This project is for portfolio demonstration purposes.

---

**🎯 Ready to showcase your full-stack development skills!**

Your FoodHub application demonstrates:
- Modern React development
- Professional UI/UX design
- Payment gateway integration
- State management
- Responsive design
- Security best practices
