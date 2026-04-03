# Shadi Card - Complete Wedding Invitation Website

## 🎉 Project Overview

A **production-ready**, full-stack wedding invitation card printing website built with modern technologies. This application allows customers to browse designs, customize cards, place orders, and track delivery - all with a seamless user experience.

## ✨ Key Features

### Customer Features

- ✅ Browse 500+ invitation designs
- ✅ Filter by religion, price, paper type
- ✅ Real-time customization
- ✅ Live price calculation
- ✅ Multiple payment options (UPI, COD)
- ✅ OTP-based authentication
- ✅ Order tracking system
- ✅ Order history
- ✅ WhatsApp integration
- ✅ Mobile responsive design

### Technical Features

- ✅ RESTful API architecture
- ✅ MongoDB database with indexes
- ✅ JWT authentication
- ✅ Razorpay payment integration
- ✅ Real-time order status updates
- ✅ Secure payment verification
- ✅ Environment-based configuration
- ✅ Error handling & validation
- ✅ Clean code architecture

## 🛠 Technology Stack

### Frontend

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **Razorpay SDK** - Payment integration

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Razorpay API** - Payment processing

## 📁 Project Structure

```
shadi-card/
├── backend/                    # Node.js Backend
│   ├── config/                # Database configuration
│   ├── middleware/            # Auth & error handlers
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoints
│   ├── seed.js               # Database seeder
│   └── server.js             # Entry point
│
├── frontend/                  # React Frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── utils/            # Utilities
│   │   ├── App.js            # Main app
│   │   └── index.js          # Entry point
│   └── tailwind.config.js    # Tailwind configuration
│
├── README.md                  # This file
├── QUICKSTART.md             # Quick setup guide
├── DEPLOYMENT.md             # Deployment instructions
└── SAMPLE_DATA.md            # Sample data guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Razorpay account

### Installation

1. **Clone & Navigate**

```bash
cd d:\github-projects\shadi-card
```

2. **Backend Setup**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run seed        # Add sample data
npm run dev         # Start server
```

3. **Frontend Setup**

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm start           # Start app
```

4. **Visit** http://localhost:3000

## 📊 Database Models

### User

- Mobile number (unique)
- Name, Email
- OTP verification
- Multiple addresses
- Timestamps

### Design

- Title, Description
- Category (hindu/muslim/christian/modern/traditional)
- Images (front/inside/back)
- Pricing (base + per hundred)
- Paper options with multipliers
- Delivery days
- Featured flag

### Order

- Unique Order ID (SC + timestamp)
- Design & Customization reference
- Quantity & pricing
- Shipping address
- Payment method & status
- Order status (ordered → delivered)
- Status history with timestamps
- Tracking number

### Customization

- Design reference
- Bride & Groom names
- Event date & time
- Venue details
- Language & font selection
- Extra notes

### Payment

- Order reference
- Razorpay IDs
- Amount & currency
- Payment status
- Method (UPI/COD)

## 🔌 API Endpoints

### Designs

```
GET    /api/designs              # List with filters
GET    /api/designs/:id          # Single design
GET    /api/designs/categories/list  # Categories
POST   /api/designs              # Create (admin)
PUT    /api/designs/:id          # Update (admin)
DELETE /api/designs/:id          # Delete (admin)
```

### Orders

```
POST   /api/orders                    # Create order
GET    /api/orders/:id                # Get by ID
POST   /api/orders/track              # Track order
GET    /api/orders/user/:userId       # User orders
POST   /api/orders/verify-payment     # Verify payment
PATCH  /api/orders/:id/status         # Update status
```

### Users

```
POST   /api/users/send-otp           # Send OTP
POST   /api/users/verify-otp         # Verify & login
GET    /api/users/profile/:userId    # Get profile
PUT    /api/users/profile/:userId    # Update profile
POST   /api/users/address/:userId    # Add address
```

### Customizations

```
POST   /api/customizations          # Create
GET    /api/customizations/:id      # Get by ID
PUT    /api/customizations/:id      # Update
```

## 💳 Payment Flow

1. Customer fills checkout form
2. Backend creates order in database
3. Razorpay order created (if UPI)
4. Customer completes payment
5. Frontend receives payment response
6. Backend verifies signature
7. Order status updated
8. Success page displayed

## 🔒 Security Features

- JWT token authentication
- Password-less OTP login
- Razorpay signature verification
- Input validation
- CORS protection
- Environment variable security
- MongoDB injection prevention

## 📱 Pages Implemented

1. **Home** - Hero, categories, featured designs
2. **Designs** - Listing with filters
3. **Design Details** - Images, pricing, options
4. **Customize** - Form for card details
5. **Checkout** - Address & payment
6. **Order Success** - Confirmation
7. **Track Order** - Status timeline
8. **Contact** - Contact form & info
9. **Login** - OTP authentication
10. **My Orders** - Order history

## 🎨 Design Features

- Fully responsive (mobile/tablet/desktop)
- Tailwind CSS utility classes
- Clean and modern UI
- Smooth transitions
- Loading states
- Error handling
- Toast notifications ready
- WhatsApp floating button

## 📈 Performance Optimizations

- Database indexing on frequently queried fields
- Lazy loading of components
- Image optimization
- API response caching ready
- Connection pooling
- Pagination support

## 🔧 Configuration

### Environment Variables

**Backend:**

- `PORT` - Server port
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Token signing key
- `RAZORPAY_KEY_ID` - Payment gateway key
- `RAZORPAY_KEY_SECRET` - Payment gateway secret
- `FRONTEND_URL` - CORS origin

**Frontend:**

- `REACT_APP_API_URL` - Backend API endpoint
- `REACT_APP_RAZORPAY_KEY_ID` - Payment key

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Recommended Stack:**

- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas
- Monitoring: Sentry / LogRocket

## 🧪 Testing

### Manual Testing Checklist

- [ ] Browse designs with filters
- [ ] View design details
- [ ] Customize card
- [ ] Place order (UPI)
- [ ] Place order (COD)
- [ ] Track order
- [ ] Login with OTP
- [ ] View order history
- [ ] Test on mobile

### Test Credentials

- **Mobile:** Any 10-digit number
- **OTP:** Check console in dev mode
- **Payment:** Use Razorpay test cards

## 📝 Code Quality

- Clean folder structure
- Reusable components
- Proper error handling
- Consistent naming
- Comments where needed
- ES6+ syntax
- Async/await patterns
- RESTful API design

## 🔮 Future Enhancements

- [ ] Admin dashboard
- [ ] Real SMS integration
- [ ] Email notifications
- [ ] Image upload for custom designs
- [ ] Bulk ordering
- [ ] Discount coupons
- [ ] Reviews & ratings
- [ ] Multiple languages
- [ ] Design preview with actual data
- [ ] Social media sharing

## 📞 Support & Contact

- **Email:** info@shadicard.com
- **Phone:** +91 9876543210
- **WhatsApp:** +91 9876543210

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for amazing framework
- Tailwind CSS for utility-first CSS
- MongoDB for flexible database
- Razorpay for payment gateway
- All open-source contributors

---

**Built with ❤️ for making wedding invitations special**

For detailed setup instructions, see [QUICKSTART.md](QUICKSTART.md)
For deployment guide, see [DEPLOYMENT.md](DEPLOYMENT.md)
