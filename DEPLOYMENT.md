# Deployment Guide

## Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Razorpay account
- Git repository

## Quick Deployment Steps

### 1. MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or allow from anywhere: 0.0.0.0/0)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/shadi-card?retryWrites=true&w=majority
   ```

### 2. Razorpay Setup

1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Generate Test/Live keys
4. Save Key ID and Key Secret

### 3. Backend Deployment (Render.com)

1. Create account at https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:

   - **Name**: shadi-card-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add Environment Variables:

   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-url>
   JWT_SECRET=<generate-random-string>
   RAZORPAY_KEY_ID=<your-key-id>
   RAZORPAY_KEY_SECRET=<your-key-secret>
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

6. Deploy

### 4. Frontend Deployment (Vercel)

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Navigate to frontend folder:

   ```bash
   cd frontend
   ```

3. Create `.env.production`:

   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_RAZORPAY_KEY_ID=<your-key-id>
   ```

4. Deploy:

   ```bash
   vercel --prod
   ```

   Or via Vercel Dashboard:

   - Go to https://vercel.com
   - Import your GitHub repository
   - Root Directory: `frontend`
   - Framework Preset: Create React App
   - Add environment variables
   - Deploy

### 5. Alternative Deployment Options

#### Backend Options:

- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **AWS EC2**: For more control
- **DigitalOcean**: App Platform

#### Frontend Options:

- **Netlify**: https://netlify.com
- **AWS S3 + CloudFront**: For static hosting
- **GitHub Pages**: Free but limited

## Production Checklist

### Security

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set proper CORS origins
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Hide error stack traces in production

### Performance

- [ ] Enable compression
- [ ] Add caching headers
- [ ] Optimize images
- [ ] Use CDN for static assets
- [ ] Add database indexes
- [ ] Enable MongoDB connection pooling

### Monitoring

- [ ] Set up error logging (Sentry)
- [ ] Add analytics (Google Analytics)
- [ ] Monitor uptime (UptimeRobot)
- [ ] Set up alerts

### Features to Complete

- [ ] Integrate real SMS service for OTP
- [ ] Add email notifications
- [ ] Set up backup strategy
- [ ] Add admin dashboard
- [ ] Implement order status webhooks

## Environment Variables Summary

### Backend (.env)

```bash
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shadi-card
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
RAZORPAY_KEY_ID=rzp_test_or_live_keyid
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=https://yoursite.vercel.app
OTP_EXPIRY=300000
```

### Frontend (.env.production)

```bash
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_or_live_keyid
```

## Post-Deployment Steps

1. **Test Complete Flow**:

   - Browse designs
   - Customize a card
   - Place test order
   - Track order
   - Login/Register

2. **Add Sample Data**:

   - Use SAMPLE_DATA.md to add designs
   - Or create admin panel

3. **Go Live**:
   - Switch to Razorpay Live keys
   - Update domain settings
   - Test payment flow
   - Launch!

## Troubleshooting

### Backend Issues

- Check environment variables
- Verify MongoDB connection
- Check server logs
- Ensure port is not blocked

### Frontend Issues

- Clear browser cache
- Check API URL
- Verify CORS settings
- Check console errors

### Payment Issues

- Verify Razorpay keys
- Check test mode vs live mode
- Ensure webhook is configured
- Check payment logs in Razorpay dashboard

## Support

For deployment help:

- Backend issues: Check Render/Railway logs
- Frontend issues: Check Vercel/Netlify logs
- Database issues: Check MongoDB Atlas metrics
- Payment issues: Check Razorpay dashboard

## Estimated Costs (Monthly)

### Free Tier (Testing)

- MongoDB Atlas: Free (512MB)
- Render: Free with limitations
- Vercel: Free
- **Total: $0**

### Production (Small Scale)

- MongoDB Atlas: $9 (Shared M2)
- Render: $7 (Starter)
- Vercel: Free
- Razorpay: 2% transaction fee
- **Total: ~$16 + transaction fees**

### Production (Medium Scale)

- MongoDB Atlas: $25 (M10)
- Render: $25 (Standard)
- Vercel: $20 (Pro)
- SMS Service: ~$10
- Email Service: ~$15
- **Total: ~$95 + transaction fees**
