# Payment System Implementation 💳

## Overview
यह document बताता है कि Shadi Card application में Razorpay payment system को कैसे implement किया गया है।

---

## 🔄 Complete Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Product Select करता है                              │
│    - ProductDetailPage से "Buy Now" पर click                 │
│    - या Cart से "Buy Now" पर click                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. CheckoutPage पर Redirect                                  │
│    - Address form fill करना                                  │
│    - Mobile number validation (10 digits)                    │
│    - Quantity और price details दिखाना                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. "Place Order & Pay" Button Click                         │
│    - Frontend order data prepare करता है                     │
│    - POST /api/orders पर request भेजता है                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend Order Creation (paymentStatus: 'pending')        │
│    - Order MongoDB में save होता है                          │
│    - Razorpay order create होता है                          │
│    - Payment record create होता है (status: 'created')      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Razorpay Payment Modal Opens                             │
│    - User UPI/Card/Netbanking select करता है                │
│    - Payment complete करता है                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Payment Success Handler Triggered                        │
│    - razorpay_payment_id, order_id, signature मिलता है      │
│    - POST /api/orders/verify-payment को call करता है       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Backend Payment Verification                             │
│    - Razorpay signature verify करता है (crypto)             │
│    - Payment status 'captured' में update होता है           │
│    - Order status 'confirmed' में update होता है            │
│    - paymentStatus 'paid' में update होता है                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Success Page पर Redirect                                 │
│    - Order details show होती हैं                            │
│    - Confetti animation play होता है                        │
│    - Cart clear होता है                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

### Backend Files

#### 1. **backend/models/Order.js**
```javascript
// Order Schema Fields
{
  orderId: String,           // Auto-generated: SC{timestamp}{random}
  user: ObjectId,            // Logged-in user reference
  guestName: String,         // Guest user name
  guestMobile: String,       // Guest user mobile
  productInfo: {             // Static product details
    id, name, slug, price, image
  },
  quantity: Number,          // Cards quantity (min: 1)
  pricePerCard: Number,      // Per card price
  totalAmount: Number,       // Total payment amount
  shippingAddress: {         // Delivery address (all required)
    name, mobile, addressLine1, addressLine2,
    city, state, pincode
  },
  paymentMethod: String,     // 'upi', 'card', 'netbanking', 'wallet', 'online', 'cod'
  paymentStatus: String,     // 'pending', 'paid', 'failed', 'refunded'
  orderStatus: String,       // 'ordered', 'confirmed', 'printing', 'shipped', 'delivered', 'cancelled'
  statusHistory: Array,      // Status change log
  estimatedDelivery: Date    // Calculated delivery date
}
```

#### 2. **backend/models/Payment.js**
```javascript
// Payment Schema Fields
{
  order: ObjectId,              // Order reference
  razorpayOrderId: String,      // Razorpay order ID
  razorpayPaymentId: String,    // Payment ID (after success)
  razorpaySignature: String,    // Signature (for verification)
  amount: Number,               // Payment amount
  currency: String,             // 'INR'
  status: String,               // 'created', 'authorized', 'captured', 'failed'
  method: String                // 'upi', 'card', 'netbanking', 'wallet', 'cod'
}
```

#### 3. **backend/routes/orders.js**

##### Route 1: Create Order
```javascript
POST /api/orders

Request Body:
{
  productInfo: { id, name, slug, price, image },
  quantity: 100,
  pricePerCard: 20,
  totalAmount: 2000,
  shippingAddress: {
    name: "User Name",
    mobile: "9876543210",
    addressLine1: "Address",
    city: "City",
    state: "State",
    pincode: "123456"
  },
  paymentMethod: "online",
  user: "userId" // या guestName/guestMobile
}

Response:
{
  success: true,
  data: {
    order: { orderId, totalAmount, ... },
    razorpayOrder: { id, amount, currency }
  }
}

Backend Process:
1. Validate all required fields
2. Create Order in MongoDB (paymentStatus: 'pending')
3. Create Razorpay order via API
4. Create Payment record (status: 'created')
5. Return order + razorpayOrder data
```

##### Route 2: Verify Payment
```javascript
POST /api/orders/verify-payment

Request Body:
{
  razorpayOrderId: "order_xyz",
  razorpayPaymentId: "pay_abc",
  razorpaySignature: "signature_hash",
  orderId: "SC123456789",
  paymentMethod: "upi"
}

Response:
{
  success: true,
  message: "Payment verified successfully",
  order: { /* updated order details */ }
}

Backend Process:
1. Generate expected signature using HMAC SHA256
2. Compare with received signature
3. If match:
   - Update Payment: status='captured', method=actual_method
   - Update Order: paymentStatus='paid', orderStatus='confirmed'
   - Add to statusHistory
4. If not match:
   - Update Payment: status='failed'
   - Update Order: paymentStatus='failed'
5. Return result
```

##### Route 3: Payment Failed
```javascript
POST /api/orders/payment-failed

Request Body:
{
  orderId: "SC123456789",
  errorCode: "payment_failed",
  errorDescription: "User cancelled payment"
}

Response:
{
  success: true,
  message: "Payment failure recorded"
}

Backend Process:
1. Find order by orderId
2. Update Order: paymentStatus='failed'
3. Update Payment: status='failed'
4. Add failure note to statusHistory
```

---

### Frontend Files

#### 1. **frontend/src/pages/CheckoutPage.jsx**

##### Key Functions:

**handlePayment(orderData)**
```javascript
// Razorpay payment modal open करता है
const options = {
  key: RAZORPAY_KEY_ID,
  amount: razorpayOrder.amount,      // Paise में (₹20 = 2000 paise)
  currency: 'INR',
  order_id: razorpayOrder.id,
  
  // Success handler
  handler: async function(response) {
    // Verify payment
    await verifyPayment({
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      orderId: order.orderId
    });
    
    // Clear cart
    clearCart();
    
    // Navigate to success page
    navigate('/order-success', { state: { order } });
  },
  
  // Failure handler
  on('payment.failed', function(response) {
    // Record failure
    recordPaymentFailure(orderId, errorCode, errorDescription);
    alert('Payment failed');
  })
};

const rzp = new Razorpay(options);
rzp.open();
```

**handleSubmit(e)**
```javascript
// Form submit handler
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Validate address fields
  if (!address.name || !address.mobile || ...) {
    alert('Please fill all fields');
    return;
  }
  
  // 2. Validate mobile (10 digits)
  if (!/^\d{10}$/.test(address.mobile)) {
    alert('Invalid mobile number');
    return;
  }
  
  // 3. Prepare order data
  const orderData = {
    productInfo: { ... },
    quantity: quantity || 100,
    pricePerCard: calculatedPrice,
    totalAmount: calculatedTotal,
    shippingAddress: { ...address },
    paymentMethod: paymentMethod || 'online',
    orderType: orderType || 'manual',
    user: user?.id
  };
  
  // 4. Create order
  const response = await orderService.createOrder(orderData);
  
  // 5. Open payment modal
  await handlePayment(response.data);
};
```

#### 2. **frontend/src/services/api.service.js**

```javascript
export const orderService = {
  // Order create करना
  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  
  // Payment verify करना
  verifyPayment: async (data) => {
    const response = await api.post('/orders/verify-payment', data);
    return response.data;
  }
};
```

#### 3. **frontend/src/pages/OrderSuccessPage.jsx**

```javascript
// Success page features:
- ✅ Confetti animation
- ✅ Fireworks effect
- ✅ Order details display
- ✅ Payment status (paid/pending)
- ✅ Estimated delivery date
- ✅ WhatsApp confirmation link
- ✅ Track order button
- ✅ Browse more designs button
```

---

## 🔐 Security Implementation

### 1. Payment Signature Verification
```javascript
// Backend: Razorpay signature verify करना
const crypto = require('crypto');

const sign = razorpayOrderId + '|' + razorpayPaymentId;
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(sign.toString())
  .digest('hex');

if (razorpaySignature === expectedSignature) {
  // Payment verified ✅
} else {
  // Payment verification failed ❌
}
```

### 2. Server-Side Validation
```javascript
// हर field validate होती है backend में:
- quantity >= 1
- pricePerCard >= 0
- shippingAddress.mobile exists (10 digits)
- paymentMethod exists
- All required address fields present
```

### 3. Order ID Generation
```javascript
// Unique order ID generate होती है:
const timestamp = Date.now().toString().slice(-6);
const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
orderId = `SC${timestamp}${random}`;

// Example: SC789456123
```

---

## 💰 Payment Amount Calculation

```javascript
// Frontend
const quantity = 100;                    // Cards quantity
const pricePerCard = 20;                // Per card price (₹)
const totalAmount = quantity * pricePerCard;  // ₹2000

// Backend (Razorpay order)
const amountInPaise = totalAmount * 100;  // 200000 paise
// Razorpay हमेशा paise में amount लेता है (1 rupee = 100 paise)
```

---

## 📊 Payment Status Flow

```
Order Created
    ↓
paymentStatus: 'pending'
orderStatus: 'ordered'
    ↓
Payment Successful
    ↓
paymentStatus: 'paid'
orderStatus: 'confirmed'
    ↓
Admin Actions
    ↓
orderStatus: 'printing' → 'shipped' → 'delivered'
```

---

## 🔑 Environment Variables Required

### Backend (.env)
```env
RAZORPAY_KEY_ID=rzp_test_RHEYsHtNLxCDbx
RAZORPAY_KEY_SECRET=PncXMtF06S6EGazFSlG4XVUK
MONGODB_URI=mongodb://localhost:27017/wedding-cards
PORT=5002
```

### Frontend (.env)
```env
VITE_RAZORPAY_KEY=rzp_test_RHEYsHtNLxCDbx
VITE_API_URL=http://localhost:5002/api
```

---

## 🧪 Testing Payment Flow

### Test Mode (Razorpay Test Keys)
```
✅ Real payment modal dikhega
✅ Test cards use कर सकते हैं
❌ Real money deduct नहीं होगा

Test Card Details:
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name

Test UPI: success@razorpay
```

### Test Cases to Check:

1. **Successful Payment**
   - Address fill करें
   - Payment complete करें
   - Order confirmed हो जाए
   - Success page दिखे
   - Cart clear हो जाए

2. **Failed Payment**
   - Payment modal में cancel करें
   - Order pending में रहे
   - Error message दिखे
   - Order ID मिले

3. **Invalid Data**
   - Invalid mobile number (9 digits)
   - Empty fields
   - Proper error messages दिखें

4. **Guest User**
   - Without login order place करें
   - Order guest name/mobile के साथ save हो

5. **Logged In User**
   - Login करके order place करें
   - Order user ID के साथ save हो

---

## 🐛 Common Issues & Solutions

### Issue 1: "method: 'online' is not a valid enum value"
**Solution:** ✅ Fixed
- Payment model से 'online' remove किया
- Payment method Razorpay response से लेते हैं
- Initial payment creation में method optional है

### Issue 2: Order created but payment not verified
**Solution:** ✅ Implemented
- Payment verification route बनाया
- Signature verification add किया
- Order status properly update होता है

### Issue 3: Cart not clearing after payment
**Solution:** ✅ Fixed
- Payment success handler में cart clear करते हैं
- User-specific या guest cart remove होता है

### Issue 4: Mobile number validation error
**Solution:** ✅ Implemented
- 10-digit validation add किया
- Proper error message दिखाते हैं

---

## 📱 Payment Methods Supported

```javascript
✅ UPI (Google Pay, PhonePe, Paytm, etc.)
✅ Credit Card / Debit Card
✅ Net Banking (All major banks)
✅ Wallets (Paytm, Mobikwik, etc.)
✅ COD (Cash on Delivery) - Backend ready, payment skip needed

Payment Method Enum:
['upi', 'card', 'netbanking', 'wallet', 'cod']
```

---

## 🔄 Status History Tracking

हर order में status changes का log रखा जाता है:

```javascript
statusHistory: [
  {
    status: 'ordered',
    timestamp: '2026-01-02T10:00:00Z',
    note: 'Order placed successfully'
  },
  {
    status: 'confirmed',
    timestamp: '2026-01-02T10:05:00Z',
    note: 'Payment verified successfully'
  },
  {
    status: 'printing',
    timestamp: '2026-01-03T09:00:00Z',
    note: 'Printing started'
  }
]
```

---

## 📈 Future Enhancements

1. **Payment Retry**
   - Failed payment को retry करने का option
   - Pending orders page से direct payment

2. **Partial Refunds**
   - Admin panel से partial amount refund
   - Refund status tracking

3. **Multiple Payment Options**
   - EMI options for high-value orders
   - Save card details for faster checkout

4. **Payment Reminders**
   - Pending payment के लिए SMS/Email reminder
   - Auto-cancel after 24 hours

5. **Invoice Generation**
   - PDF invoice generate करना
   - Email/WhatsApp पर send करना

---

## 📞 Support & Troubleshooting

### For Users:
- Payment failed? Order ID के साथ support contact करें
- Payment deducted but order not confirmed? 24 hours wait करें या contact करें

### For Developers:
- Razorpay Dashboard: https://dashboard.razorpay.com
- Check Payment logs में detailed information मिलेगी
- Webhook setup करें for automatic payment updates

---

## ✨ Summary

✅ **Complete payment integration with Razorpay**
✅ **Secure signature verification**
✅ **Proper order status management**
✅ **Payment failure handling**
✅ **User-friendly error messages**
✅ **Cart clearing after successful payment**
✅ **Success page with confetti animation**
✅ **Guest and logged-in user support**
✅ **Mobile number validation**
✅ **Status history tracking**

---

**Last Updated:** January 2, 2026
**Version:** 1.0.0
**Developer:** Shadi Card Team
