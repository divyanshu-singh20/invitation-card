# Sample Design Data

To populate your database with sample designs, you can use the following commands:

## Method 1: Using curl

```bash
# Hindu Wedding Card
curl -X POST http://localhost:5000/api/designs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Royal Hindu Wedding Invitation",
    "description": "Elegant traditional design with golden borders and sacred symbols",
    "category": "hindu",
    "images": [
      {
        "url": "https://via.placeholder.com/600x800/FF6B6B/FFFFFF?text=Hindu+Card+Front",
        "type": "front"
      },
      {
        "url": "https://via.placeholder.com/600x800/FFA07A/FFFFFF?text=Hindu+Card+Inside",
        "type": "inside"
      }
    ],
    "basePrice": 2500,
    "pricePerHundred": 2500,
    "paperOptions": [
      { "type": "standard", "priceMultiplier": 1 },
      { "type": "premium", "priceMultiplier": 1.5 },
      { "type": "luxury", "priceMultiplier": 2 }
    ],
    "colors": [
      { "name": "Gold", "code": "#FFD700" },
      { "name": "Red", "code": "#DC143C" }
    ],
    "availableFonts": [
      { "name": "Arial", "previewUrl": "" },
      { "name": "Times New Roman", "previewUrl": "" },
      { "name": "Georgia", "previewUrl": "" }
    ],
    "deliveryDays": 7,
    "featured": true,
    "tags": ["traditional", "golden", "elegant"]
  }'

# Muslim Wedding Card
curl -X POST http://localhost:5000/api/designs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Islamic Nikah Invitation",
    "description": "Beautiful Islamic design with Arabic calligraphy",
    "category": "muslim",
    "images": [
      {
        "url": "https://via.placeholder.com/600x800/4ECDC4/FFFFFF?text=Muslim+Card+Front",
        "type": "front"
      }
    ],
    "basePrice": 2200,
    "pricePerHundred": 2200,
    "paperOptions": [
      { "type": "standard", "priceMultiplier": 1 },
      { "type": "premium", "priceMultiplier": 1.5 }
    ],
    "deliveryDays": 7,
    "featured": true,
    "tags": ["islamic", "nikah", "elegant"]
  }'

# Christian Wedding Card
curl -X POST http://localhost:5000/api/designs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Church Wedding Invitation",
    "description": "Classic Christian wedding card with cross and floral design",
    "category": "christian",
    "images": [
      {
        "url": "https://via.placeholder.com/600x800/95E1D3/FFFFFF?text=Christian+Card+Front",
        "type": "front"
      }
    ],
    "basePrice": 2000,
    "pricePerHundred": 2000,
    "paperOptions": [
      { "type": "standard", "priceMultiplier": 1 },
      { "type": "premium", "priceMultiplier": 1.5 }
    ],
    "deliveryDays": 7,
    "featured": false,
    "tags": ["church", "cross", "floral"]
  }'

# Modern Minimal Card
curl -X POST http://localhost:5000/api/designs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Modern Minimalist Invitation",
    "description": "Clean and contemporary design with simple elegance",
    "category": "modern",
    "images": [
      {
        "url": "https://via.placeholder.com/600x800/F38181/FFFFFF?text=Modern+Card+Front",
        "type": "front"
      }
    ],
    "basePrice": 1800,
    "pricePerHundred": 1800,
    "paperOptions": [
      { "type": "standard", "priceMultiplier": 1 },
      { "type": "premium", "priceMultiplier": 1.5 }
    ],
    "deliveryDays": 5,
    "featured": true,
    "tags": ["modern", "minimal", "simple"]
  }'

# Traditional Card
curl -X POST http://localhost:5000/api/designs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Traditional Indian Wedding Card",
    "description": "Rich traditional design with ethnic patterns",
    "category": "traditional",
    "images": [
      {
        "url": "https://via.placeholder.com/600x800/AA96DA/FFFFFF?text=Traditional+Card+Front",
        "type": "front"
      }
    ],
    "basePrice": 3000,
    "pricePerHundred": 3000,
    "paperOptions": [
      { "type": "standard", "priceMultiplier": 1 },
      { "type": "premium", "priceMultiplier": 1.5 },
      { "type": "luxury", "priceMultiplier": 2.5 }
    ],
    "deliveryDays": 10,
    "featured": true,
    "tags": ["traditional", "ethnic", "premium"]
  }'
```

## Method 2: Using Node.js Script

Create a file `backend/seed.js`:

```javascript
require("dotenv").config();
const mongoose = require("mongoose");
const Design = require("./models/Design");

const designs = [
  {
    title: "Royal Hindu Wedding Invitation",
    description: "Elegant traditional design with golden borders",
    category: "hindu",
    images: [{ url: "https://via.placeholder.com/600x800", type: "front" }],
    basePrice: 2500,
    pricePerHundred: 2500,
    paperOptions: [
      { type: "standard", priceMultiplier: 1 },
      { type: "premium", priceMultiplier: 1.5 },
    ],
    deliveryDays: 7,
    featured: true,
  },
  // Add more designs here
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await Design.deleteMany({}); // Clear existing
    await Design.insertMany(designs);
    console.log("Sample data inserted");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

Run: `node seed.js`

## Testing OTP Login

In development mode, the OTP is displayed in the API response. Check your console or API response for the OTP when testing login.

For production, integrate with SMS service like:

- Twilio
- AWS SNS
- MSG91
- Fast2SMS

## Testing Razorpay

Use Razorpay test mode credentials:

- Test Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date
