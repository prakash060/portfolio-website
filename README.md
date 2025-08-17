# 🍽️ FoodHub - Online Food Selling Website

A modern, responsive React-based website for selling food online with full authentication and shopping cart functionality.

## ✨ Features

### 🏠 Home Page
- Beautiful hero section with call-to-action buttons
- Featured food showcase with sample images
- Modern, responsive design with Material-UI components

### 🔐 Authentication System
- **User Sign Up**: Complete registration form with validation
- **User Sign In**: Secure login with email/password
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Session Management**: Persistent login state using localStorage

### 🍕 Food Catalog
- **Complete Menu Display**: All food items with images, descriptions, and prices
- **Category Filtering**: Filter by food categories (Pizza, Burgers, Salads, etc.)
- **Search Functionality**: Search through food names and descriptions
- **Add to Cart**: One-click cart addition with quantity management
- **Rating System**: Food ratings and reviews display

### 🛒 Shopping Cart & Checkout
- **Cart Management**: Add, remove, and update item quantities
- **Real-time Updates**: Cart updates instantly across all components
- **Order Summary**: Detailed breakdown of cart items and total
- **Persistent Storage**: Cart data saved in localStorage
- **Empty Cart State**: User-friendly empty cart experience
- **Complete Checkout Process**: Multi-step checkout with delivery details and payment
- **Order Confirmation**: Detailed order confirmation with tracking
- **Order History**: View and track all past orders
- **Order Status Tracking**: Real-time order status updates

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Material-UI components with custom theming
- **Smooth Navigation**: Intuitive routing between pages
- **Loading States**: Proper loading indicators and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foodhub-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Header.js        # Navigation header with cart icon
│   ├── Home.js          # Landing page with food showcase
│   ├── SignUp.js        # User registration form
│   ├── SignIn.js        # User login form
│   ├── FoodCatalog.js   # Main food listing page
│   ├── CartPage.js      # Shopping cart page
│   └── ProtectedRoute.js # Route protection component
├── context/             # React Context for state management
│   ├── AuthContext.js   # Authentication state
│   └── CartContext.js   # Shopping cart state
├── data/                # Static data
│   └── foodData.js      # Sample food items
├── App.js               # Main app component with routing
└── index.js             # App entry point
```

## 🔧 Technology Stack

- **Frontend Framework**: React 18
- **Routing**: React Router DOM
- **UI Components**: Material-UI (MUI)
- **State Management**: React Context API
- **Styling**: Material-UI with custom theming
- **Icons**: Material-UI Icons
- **Data Storage**: localStorage (for demo purposes)

## 📱 User Flow

1. **Home Page** → User sees food showcase and can sign up/sign in
2. **Sign Up** → User creates account and is redirected to sign in
3. **Sign In** → User logs in and is redirected to food catalog
4. **Food Catalog** → User browses menu, adds items to cart
5. **Cart Page** → User reviews cart, manages quantities, proceeds to checkout

## 🎯 Key Features Implementation

### Authentication Flow
- User registration with validation
- Secure login system
- Protected routes for authenticated users
- Automatic redirection after successful actions

### Shopping Cart System
- Add/remove items with quantity management
- Real-time cart updates across components
- Persistent cart data storage
- Total price calculation
- Cart item count display in header

### Complete Checkout System
- **Multi-step Checkout Process**: Delivery details → Payment method → Order review
- **Delivery Management**: Address, phone, delivery instructions
- **Payment Options**: Credit card, UPI payment, and cash on delivery
- **Order Processing**: Order confirmation with unique ID
- **Order Tracking**: Real-time status updates (Preparing → On the Way → Delivered)
- **Order History**: Complete order management and history
- **Tax & Delivery Calculation**: Automatic GST calculation (5%) with free delivery over ₹1000

### Food Management
- Sample food data with images from Unsplash
- Category-based filtering
- Search functionality
- Responsive grid layout
- Food ratings and descriptions

## 🔒 Security Features

- **Protected Routes**: Unauthenticated users cannot access protected pages
- **Input Validation**: Form validation for user inputs
- **Session Management**: Secure user session handling
- **Route Protection**: Automatic redirection for unauthorized access

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive design for tablets
- **Desktop Experience**: Full-featured desktop interface
- **Touch Friendly**: Optimized for touch interactions

## 🚀 Future Enhancements

- **Backend Integration**: Connect to real database and API
- **Payment Processing**: Integrate real payment gateways (Stripe, PayPal)
- **Order Management**: Advanced order processing with restaurant dashboard
- **User Profiles**: User account management and preferences
- **Admin Panel**: Restaurant management interface for orders and menu
- **Real-time Updates**: Live order tracking with WebSocket
- **Push Notifications**: Order status updates and delivery alerts
- **Delivery Partner App**: Driver/rider management system
- **Analytics Dashboard**: Sales reports and customer insights
- **Loyalty Program**: Points system and rewards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Material-UI**: For the beautiful component library
- **Unsplash**: For the high-quality food images
- **React Team**: For the amazing framework
- **Food Icons**: For the delicious emojis 🍕🍔🥗

## 📞 Support

If you have any questions or need help with the project, please open an issue in the repository.

---

**Happy coding and happy eating! 🍽️✨**
