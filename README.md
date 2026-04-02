# FreshShop - Production E-commerce Application

A complete e-commerce shopping cart application built with React, Firebase, and Stripe payment processing.

## 🚀 Features

### Core Functionality
- **Multi-provider Authentication** (Google, Facebook, Email/Password)
- **Product Catalog** with categories (Fruits, Vegetables, Dairy, Bakery, etc.)
- **Shopping Cart** with persistent storage
- **Secure Checkout** with Stripe payment processing
- **Order Management** with order history and tracking
- **Admin Panel** for product management (CRUD operations)
- **Real-time Updates** using Firebase Firestore
- **Responsive Design** for mobile and desktop

### Production Features
- **Firebase Integration** for authentication and database
- **Stripe Payment Processing** for secure transactions
- **Real-time Data Sync** across all users
- **Persistent Cart** per user account
- **Order Tracking** and confirmation system
- **Admin Dashboard** for inventory management
- **Toast Notifications** for user feedback
- **Loading States** and error handling
- **Sri Lankan Rupee** currency support

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4 with Hooks
- **Styling**: Tailwind CSS 3.4.19
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Payments**: Stripe
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM 6.11.2

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Stripe account

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd shopping-cart
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Google, Facebook, and Email/Password providers
3. Enable Firestore Database
4. Enable Storage (optional, for product images)
5. Get your Firebase config from Project Settings

### 3. Stripe Setup

1. Create a Stripe account at [https://stripe.com/](https://stripe.com/)
2. Get your publishable key from the Stripe Dashboard
3. For production, you'll need to set up webhooks and a backend server

### 4. Environment Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Environment
REACT_APP_ENVIRONMENT=development
```

### 5. Seed Initial Data

The application will automatically create initial product data when you first run it as an admin user.

### 6. Run the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🔧 Admin Setup

1. Register/Login with an email containing "admin" (e.g., `admin@freshshop.com`)
2. Access the admin panel at `/admin`
3. Add, edit, and manage products through the admin interface

## 📱 Usage

### For Customers:
1. **Register/Login** using Google, Facebook, or Email
2. **Browse Products** by category
3. **Add to Cart** and manage quantities
4. **Checkout** with secure Stripe payment
5. **Track Orders** in your order history

### For Admins:
1. **Login** with admin credentials
2. **Manage Products** - Add, edit, delete products
3. **View Orders** - Monitor all customer orders
4. **Update Inventory** - Real-time product management

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation with auth/cart
│   ├── ProductCard.js  # Product display card
│   └── CheckoutForm.js # Stripe payment form
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── CartContext.js  # Shopping cart state
├── pages/              # Page components
│   ├── Home.js         # Product catalog
│   ├── CartPage.js     # Shopping cart
│   ├── CheckoutPage.js # Payment processing
│   ├── OrdersPage.js   # Order history
│   ├── AdminPage.js    # Admin dashboard
│   └── LoginPage.js    # Authentication
├── services/           # External service integrations
│   ├── firebase.js     # Firebase configuration
│   ├── firestore.js    # Database operations
│   └── stripe.js       # Payment processing
├── data.js             # Initial product data
├── App.js              # Main application component
└── index.js            # Application entry point
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login and initialize:
```bash
firebase login
firebase init hosting
```

3. Deploy:
```bash
firebase deploy
```

### Environment Variables for Production

Make sure to set environment variables in your hosting platform:

- `REACT_APP_FIREBASE_*` - Firebase configuration
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `REACT_APP_ENVIRONMENT=production`

## 🔒 Security Notes

- **Firebase Security Rules**: Configure Firestore security rules for production
- **Stripe Webhooks**: Implement server-side webhook handling for payment confirmations
- **Environment Variables**: Never commit sensitive keys to version control
- **Admin Access**: Implement proper role-based access control for production

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run build to check for errors
npm run build
```

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading of routes
- **Image Optimization**: Use optimized images for products
- **Caching**: Firebase caching and localStorage for cart persistence
- **Bundle Analysis**: Analyze bundle size with `npm install -g webpack-bundle-analyzer`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review Firebase and Stripe documentation

## 🎯 Future Enhancements

- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filtering
- [ ] Inventory management system
- [ ] Email notifications for orders
- [ ] Mobile app with React Native
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Loyalty program
- [ ] Social commerce features

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
