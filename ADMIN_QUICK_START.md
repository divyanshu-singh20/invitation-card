# 🚀 Quick Start Guide - Admin Panel

## ✅ Setup Complete!

Your admin panel is now ready to use.

---

## 🔐 Admin Login Credentials

**URL:** http://localhost:3000/admin/login

**Default Credentials:**

- **Email:** admin@weddingcards.com
- **Password:** admin123

⚠️ **IMPORTANT:** Change this password after first login!

---

## 📋 Quick Access Links

### Public Website

- **Home:** http://localhost:3000
- **Designs:** http://localhost:3000/designs
- **Track Order:** http://localhost:3000/track-order
- **Contact:** http://localhost:3000/contact

### Admin Panel

- **Login:** http://localhost:3000/admin/login
- **Dashboard:** http://localhost:3000/admin
- **Orders:** http://localhost:3000/admin/orders
- **Designs:** http://localhost:3000/admin/designs
- **Customers:** http://localhost:3000/admin/customers
- **Payments:** http://localhost:3000/admin/payments
- **Settings:** http://localhost:3000/admin/settings

### API Endpoints

- **Health Check:** http://localhost:5000/api/health
- **Admin API:** http://localhost:5000/api/admin/\*

---

## 🎯 First Steps After Login

### 1. Change Admin Password

- Login to admin panel
- Go to Settings (will add password change feature)

### 2. Add Wedding Card Designs

- Go to **Designs** page
- Click **+ Add New Design**
- Fill in:
  - Name (e.g., "Golden Royal Hindu Card")
  - Description
  - Category (Hindu, Muslim, Christian, Modern, Traditional)
  - Price (per 100 cards)
  - Image URL (use placeholder: https://via.placeholder.com/400x600)
  - Paper Types
- Click **Add Design**

### 3. Configure Settings

- Go to **Settings** page
- Update:
  - **Delivery Days:** Default 7 days
  - **WhatsApp Number:** Your business WhatsApp (with country code)
  - **Minimum Order Quantity:** Default 100 cards
  - **Shipping Charges:** Set shipping cost
  - **Policies:** Add Terms, Privacy Policy, Refund Policy
- Click **Save Settings**

### 4. Test Order Flow

- Visit public website: http://localhost:3000
- Browse designs
- Place a test order
- Check admin dashboard for new order
- Update order status through admin panel

---

## 📦 Managing Orders

### Order Status Workflow:

1. **Received** → Order just placed
2. **Designing** → Working on customization
3. **Printing** → Cards being printed
4. **Dispatched** → Order shipped
5. **Delivered** → Customer received
6. **Cancelled** → Order cancelled (refund)

### To Process an Order:

1. Go to **Orders** page
2. Click on order ID to view details
3. Review customization details (bride/groom names, date, venue)
4. Update status using dropdown or sidebar buttons
5. Download print PDF
6. Mark payment as paid (for COD)

---

## 💰 Payment Management

### For UPI Payments:

- Automatically marked as "paid" after successful Razorpay transaction

### For COD (Cash on Delivery):

- Initially marked as "pending"
- After delivery, go to **Payments** page
- Find the payment
- Click **Mark as Paid**

### Processing Refunds:

- Go to **Payments** page
- Find the payment to refund
- Click **Refund**
- Enter refund reason
- Order status automatically changes to "cancelled"

---

## 🎨 Design Management Tips

### Image URLs:

For testing, use placeholder images:

- `https://via.placeholder.com/400x600/FF6B6B/FFFFFF?text=Hindu+Card`
- `https://via.placeholder.com/400x600/4ECDC4/FFFFFF?text=Muslim+Card`
- `https://via.placeholder.com/400x600/95E1D3/FFFFFF?text=Christian+Card`

For production, upload images to:

- Cloudinary
- AWS S3
- Any image hosting service

### Categories:

- **Hindu:** Traditional Hindu wedding cards
- **Muslim:** Islamic wedding invitations
- **Christian:** Church wedding cards
- **Modern:** Contemporary minimalist designs
- **Traditional:** Classic ornate designs

---

## 👥 Customer Management

### View Customer Data:

- Go to **Customers** page
- See total orders and spend per customer
- Click on customer to view order history

### Search Customers:

- Search by name or mobile number
- View purchase history
- Track customer loyalty

---

## ⚙️ Settings Configuration

### Delivery Settings:

- **Delivery Days:** How many days for standard delivery
- **Min Order Quantity:** Minimum cards customer can order
- **Shipping Charges:** Additional shipping cost

### WhatsApp Integration:

- Add your WhatsApp Business number with country code
- Format: +919876543210
- This number appears on contact page
- Used for customer support

### Policies:

- **Terms & Conditions:** Your business terms
- **Privacy Policy:** How you handle customer data
- **Refund Policy:** Your refund/cancellation rules

---

## 🔧 Troubleshooting

### Cannot Login to Admin Panel

✅ **Solution:**

- Verify email: `admin@weddingcards.com`
- Verify password: `admin123`
- Check if backend server is running
- Check MongoDB connection

### Orders Not Showing

✅ **Solution:**

- Place a test order from public website
- Refresh admin dashboard
- Check filters (clear all filters)

### Cannot Update Order Status

✅ **Solution:**

- Check network connection
- Verify admin token hasn't expired
- Try logging out and back in

### Designs Not Appearing on Website

✅ **Solution:**

- Check if design is **Active** (not disabled)
- Verify design has valid image URL
- Check category is set correctly

---

## 📊 Dashboard Statistics

The dashboard shows:

- **Total Orders:** All time order count
- **Today's Orders:** Orders placed today
- **Total Revenue:** Sum of all paid orders
- **Pending Prints:** Orders not yet dispatched

---

## 🔒 Security Best Practices

1. **Change Default Password Immediately**
2. **Use Strong Passwords** (min 8 characters, mixed case, numbers, symbols)
3. **Don't Share Admin Credentials**
4. **Logout After Use** (especially on shared computers)
5. **Regular Backups** of MongoDB database
6. **Monitor Admin Activity** regularly

---

## 📱 Mobile Access

The admin panel works on mobile devices:

- Sidebar navigation adapts to small screens
- Tables scroll horizontally
- All features accessible on mobile

---

## 🆘 Need Help?

### Documentation:

- **Admin Panel Docs:** See `ADMIN_PANEL_DOCS.md`
- **Project Overview:** See `PROJECT_OVERVIEW.md`
- **Deployment Guide:** See `DEPLOYMENT.md`

### Common Issues:

- Check MongoDB is running: `mongod --version`
- Check Node.js version: `node --version`
- View backend logs in terminal
- Check browser console for frontend errors

---

## ✨ Features Summary

### ✅ Implemented:

- [x] Admin authentication with JWT
- [x] Dashboard with real-time stats
- [x] Complete order management
- [x] Design CRUD operations
- [x] Customer analytics
- [x] Payment tracking
- [x] Settings management
- [x] Order status workflow
- [x] COD payment marking
- [x] Refund processing
- [x] Responsive admin UI
- [x] Search and filters
- [x] Protected routes

---

## 🎉 Ready to Go!

Your wedding invitation card printing website with admin panel is fully functional and ready for:

- Testing
- Adding real designs
- Processing orders
- Managing customers
- Tracking payments

**Start by logging in:** http://localhost:3000/admin/login

---

## 📞 Support

For issues or questions, check:

1. MongoDB connection
2. Backend server logs
3. Browser console
4. Network tab in DevTools

Happy Managing! 🎊
