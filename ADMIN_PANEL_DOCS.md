# Admin Panel Documentation

## 🔐 Admin Panel Overview

The admin panel provides complete control over your wedding invitation card printing website. It includes order management, design management, customer analytics, payment tracking, and website settings.

---

## 📍 Access Admin Panel

**URL:** http://localhost:3000/admin/login

**Production URL:** https://yourdomain.com/admin/login

---

## 🚀 Setup Admin Account

### Step 1: Create First Admin

Run the admin creation script:

```bash
cd backend
node createAdmin.js
```

Follow the prompts:

- Enter admin name
- Enter admin email
- Enter admin password

The script will create a super admin account.

### Alternative: Using API

If the script fails, you can use the API directly:

```bash
# POST request to create admin (only works if no admin exists)
curl -X POST http://localhost:5000/api/admin/auth/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "secure_password"
  }'
```

---

## 📊 Admin Features

### 1️⃣ Dashboard (`/admin`)

**Real-time Statistics:**

- Total Orders
- Today's Orders
- Total Revenue
- Pending Prints

**Charts:**

- Orders per day (last 7 days)
- Revenue overview

**Recent Orders:**

- Latest 5 orders with quick status view

**Quick Actions:**

- View All Orders
- Manage Designs
- View Customers
- Settings

---

### 2️⃣ Orders Management (`/admin/orders`)

**Features:**

- View all orders in a table
- Filter by:
  - Status (received, designing, printing, dispatched, delivered, cancelled)
  - Payment Type (UPI, COD)
  - Search by Order ID or Mobile Number

**Order Actions:**

- Update order status (dropdown in table)
- View full order details
- Download print PDF

**Order Detail Page (`/admin/orders/:id`):**

- Complete order information
- Design details
- Customization data (bride/groom names, date, venue)
- Shipping address
- Customer information
- Status update buttons
- Actions: Download PDF, Send WhatsApp update

**Status Workflow:**

1. **Received** - Order placed by customer
2. **Designing** - Design team working on customization
3. **Printing** - Cards being printed
4. **Dispatched** - Order shipped
5. **Delivered** - Order received by customer
6. **Cancelled** - Order cancelled (refund processed)

---

### 3️⃣ Design Management (`/admin/designs`)

**Features:**

- View all designs (active and inactive)
- Add new wedding card design
- Edit existing designs
- Enable/Disable designs
- Soft delete designs

**Design Form Fields:**

- Name
- Description
- Category (Hindu, Muslim, Christian, Modern, Traditional)
- Price (per 100 cards)
- Image URL
- Paper Types
- Tags

**Actions:**

- **Edit** - Modify design details
- **Enable/Disable** - Control visibility on public website
- **Delete** - Soft delete (can be restored)

---

### 4️⃣ Customer Management (`/admin/customers`)

**Features:**

- View all customers
- Search by name or mobile number
- Customer statistics:
  - Total orders placed
  - Total amount spent
  - Last order date

**Customer Detail View:**

- Personal information
- Complete order history
- Total spend analysis

---

### 5️⃣ Payment Management (`/admin/payments`)

**Features:**

- View all payments
- Filter by:
  - Payment Status (paid, pending, refunded)
  - Payment Method (UPI, COD)

**Payment Actions:**

**For COD Payments:**

- **Mark as Paid** - When cash is received on delivery

**For All Paid Payments:**

- **Process Refund** - Refund money and cancel order
  - Enter refund reason
  - Updates order status to cancelled
  - Records refund date

**Payment Information:**

- Order ID
- Customer details
- Amount
- Payment method
- Status
- Date

---

### 6️⃣ Settings Management (`/admin/settings`)

**Editable Settings:**

**Delivery Settings:**

- Delivery Days (default timeline)
- Minimum Order Quantity
- Shipping Charges

**Contact Settings:**

- WhatsApp Business Number

**Policies:**

- Terms & Conditions
- Privacy Policy
- Refund Policy

**Important:**

- All changes reflect immediately on public website
- Settings are stored in database
- Can be accessed via API by public website

---

## 🔒 Security Features

### JWT Authentication

- Token-based authentication
- 7-day token expiry
- Automatic logout on token expiration

### Route Protection

- All admin routes protected by middleware
- Unauthorized access redirects to login
- Token validation on every request

### Password Security

- Passwords hashed using bcryptjs
- Cannot be retrieved in plain text

---

## 📡 Admin API Endpoints

### Authentication

```
POST /api/admin/auth/login
POST /api/admin/auth/create
```

### Dashboard

```
GET /api/admin/dashboard/stats
GET /api/admin/dashboard/revenue?days=7
GET /api/admin/dashboard/orders-chart?days=7
```

### Orders

```
GET /api/admin/orders?status=&paymentType=&search=
GET /api/admin/orders/:id
PUT /api/admin/orders/:id/status
GET /api/admin/orders/:id/pdf
```

### Designs

```
GET /api/admin/designs?category=&status=
POST /api/admin/designs
PUT /api/admin/designs/:id
PATCH /api/admin/designs/:id/status
DELETE /api/admin/designs/:id
```

### Customers

```
GET /api/admin/customers?search=
GET /api/admin/customers/:id
GET /api/admin/customers/:id/orders
```

### Payments

```
GET /api/admin/payments?status=&paymentMethod=
PUT /api/admin/payments/:id/mark-paid
PUT /api/admin/payments/:id/refund
```

### Settings

```
GET /api/admin/settings
PUT /api/admin/settings
GET /api/admin/settings/:key
PUT /api/admin/settings/:key
```

---

## 🎨 Admin UI Features

- **Dark Sidebar Navigation**
- **Responsive Design** (Desktop first)
- **Real-time Data Updates**
- **Loading States**
- **Error Handling**
- **Confirmation Dialogs**
- **Success Messages**

---

## 🔄 Workflow Example

### Processing a New Order:

1. **Order Received**

   - Customer places order on website
   - Appears in admin dashboard
   - Status: "received"

2. **Start Designing**

   - Open order detail page
   - View customization details
   - Update status to "designing"

3. **Print Cards**

   - Design approved
   - Update status to "printing"
   - Download print PDF

4. **Dispatch Order**

   - Cards printed and packed
   - Update status to "dispatched"
   - Customer can track status

5. **Delivery Complete**
   - Order delivered
   - Update status to "delivered"
   - For COD: Mark payment as paid

---

## 🚨 Troubleshooting

### Cannot Login

- Check if admin account exists
- Verify email and password
- Check MongoDB connection
- Check JWT_SECRET in .env

### Cannot Update Order Status

- Verify admin token is valid
- Check network connection
- Verify MongoDB is running

### Settings Not Saving

- Check admin authentication
- Verify backend server is running
- Check MongoDB connection

---

## 📱 Mobile Responsiveness

The admin panel is optimized for desktop but works on mobile:

- Sidebar collapses on small screens
- Tables scroll horizontally
- Touch-friendly buttons
- Responsive forms

---

## 🔗 Quick Links

- **Public Website:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **API Health:** http://localhost:5000/api/health
- **Backend URL:** http://localhost:5000

---

## ⚡ Pro Tips

1. **Regular Backups:** Backup your MongoDB database regularly
2. **Strong Passwords:** Use complex passwords for admin accounts
3. **Monitor Orders:** Check dashboard daily for new orders
4. **Update Settings:** Keep WhatsApp number and policies updated
5. **Design Testing:** Test designs before enabling them
6. **Customer Communication:** Use WhatsApp for order updates

---

## 🆘 Support

For issues or questions:

- Check console for error messages
- Verify all environment variables are set
- Ensure MongoDB is running
- Check backend server logs
- Review API responses in browser DevTools

---

## 📄 License

This admin panel is part of the Wedding Invitation Card Printing Website project.
