# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### Step 2: Setup Environment Variables

#### Backend

Create `backend/.env`:

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shadi-card
JWT_SECRET=my-super-secret-jwt-key-change-in-production
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend

Create `frontend/.env`:

```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### Step 3: Start MongoDB

If you have MongoDB installed locally:

```bash
mongod
```

Or use MongoDB Atlas (free cloud database):

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in backend/.env

### Step 4: Run the Application

Open 2 terminals:

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Backend runs on http://localhost:5000

#### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

Frontend runs on http://localhost:3000

### Step 5: Add Sample Data

Open a new terminal and run:

```bash
cd backend
```

Then use curl commands from SAMPLE_DATA.md or create a seed script.

Quick example:

```bash
curl -X POST http://localhost:5000/api/designs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful Wedding Card",
    "description": "Elegant design for your special day",
    "category": "hindu",
    "images": [{"url": "https://via.placeholder.com/600x800", "type": "front"}],
    "basePrice": 2000,
    "pricePerHundred": 2000,
    "paperOptions": [{"type": "standard", "priceMultiplier": 1}],
    "deliveryDays": 7,
    "featured": true
  }'
```

## 🎉 You're Ready!

Visit http://localhost:3000 and start exploring!

## 📱 Test Login

1. Go to Login page
2. Enter any 10-digit mobile number
3. Check terminal for OTP (displayed in development mode)
4. Enter OTP to login

## 💳 Test Payment

Use Razorpay test credentials:

- Test Mode: Enabled by default
- Test Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### MongoDB Connection Error

- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Or use MongoDB Atlas

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. Review [SAMPLE_DATA.md](SAMPLE_DATA.md) for adding more designs

## 🛠 Development Tips

### Hot Reload

- Backend: Using nodemon (auto-restart on changes)
- Frontend: React hot reload (auto-refresh on changes)

### API Testing

Use tools like:

- Postman: https://postman.com
- Insomnia: https://insomnia.rest
- Thunder Client: VS Code extension

### Recommended VS Code Extensions

- ES7+ React Snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- REST Client
- GitLens

## 📞 Need Help?

- Check console for errors
- Review API responses in browser DevTools
- Read error messages carefully
- Ensure all dependencies are installed
- Verify environment variables

Happy Coding! 🎊
