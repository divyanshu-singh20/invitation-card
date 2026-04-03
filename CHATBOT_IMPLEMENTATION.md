# 🤖 Chatbot Implementation Guide

## ✅ Successfully Implemented Features

### Frontend (ChatBot Component)
- ✨ **Modern UI Design** - Gradient pink theme with smooth animations
- 💬 **Real-time Chat Interface** - Message history with user/bot distinction
- ⚡ **Quick Reply Buttons** - Pre-defined questions for easy interaction
- 🎯 **Auto-scroll & Focus** - Smooth UX with automatic scrolling
- 🔄 **Loading States** - Typing indicator with animated dots
- 📱 **Responsive Design** - Works on all screen sizes
- ⌨️ **Keyboard Support** - Enter to send, Shift+Enter for new line
- 🎨 **Beautiful Animations** - Slide-up entrance, pulse button, spin icon

### Backend (AI Integration)
- 🧠 **Google Gemini AI** - Latest gemini-pro model integration
- 💡 **Context-Aware Responses** - Understands wedding card business context
- 💰 **Pricing Information** - ₹300-₹8000 range based on categories
- 📦 **Service Details** - Delivery options, customization, bulk orders
- 🗣️ **Hinglish Support** - Natural Hindi+English mixed responses
- ⚠️ **Error Handling** - Graceful fallback messages

---

## 🚀 Quick Start

### 1. Environment Setup
Make sure `.env` file exists in backend with:
```env
GEMINI_API_KEY=your-actual-api-key-here
PORT=5002
```

### 2. Get Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create new API key
4. Copy and paste in `.env` file

### 3. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
Server will run on `http://localhost:5002`

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

### 5. Test Chatbot
- Visit any public page
- Click the floating pink chat button (bottom-right)
- Try quick reply buttons or type your question
- AI will respond in Hinglish!

---

## 📁 File Structure

```
backend/
├── .env                          # Environment variables (GEMINI_API_KEY)
├── server.js                     # Main API endpoint: POST /api/chatbot
├── controllers/
│   └── ChatController.js         # Alternative chat handler
└── routes/
    └── chat.js                   # Chat routes

frontend/
├── src/
│   ├── pages/
│   │   └── ChatBot.jsx          # ✅ Main chatbot component
│   └── components/
│       └── PublicLayout.jsx     # Global chatbot integration
```

---

## 🎯 Chatbot Capabilities

### Can Answer Questions About:
1. **Design Categories**
   - Traditional Wedding Cards
   - Modern Designer Cards
   - Premium Luxury Cards
   - Digital E-Invites
   - Custom Designs

2. **Pricing Information**
   - Traditional: ₹500-₹2000
   - Modern: ₹800-₹3000
   - Premium: ₹2500-₹8000
   - Digital: ₹300-₹1000
   - Custom: Starting ₹1500

3. **Services**
   - Free design consultation
   - Custom text & graphics
   - Multiple language support
   - Bulk order discounts (50+ cards)
   - Express delivery (2-3 days)
   - Standard delivery (5-7 days)

4. **Order Process**
   - How to place order
   - Customization options
   - Payment methods
   - Delivery tracking

---

## 🎨 UI Features

### Chat Window Design
- **Header**: Gradient pink with sparkle icon and title
- **Messages**: White bubbles for bot, pink gradient for user
- **Quick Replies**: 5 common questions as clickable buttons
- **Input Area**: Rounded input with send button icon
- **Animations**: 
  - Slide-up entrance
  - Pulse floating button
  - Bounce typing indicator
  - Smooth scrolling

### Color Scheme
- Primary: Pink-600 to Rose-600 gradient
- Background: White with subtle pink gradient
- Text: Gray-800 for readability
- Borders: Pink-100 for subtle separation

---

## 🔧 Customization Options

### Modify Quick Replies
Edit in [ChatBot.jsx](frontend/src/pages/ChatBot.jsx#L15-L21):
```javascript
const quickReplies = [
  "Design options dikhao",
  "Price kya hai?",
  "Order kaise kare?",
  "Delivery time?",
  "Custom design possible hai?"
];
```

### Update AI Context
Edit prompt in [server.js](backend/server.js#L209-L250):
```javascript
const prompt = `
You are an AI assistant for "Shadi Card"...
[Update pricing, services, guidelines here]
`;
```

### Change Theme Colors
Update Tailwind classes in ChatBot.jsx:
- `from-pink-600 to-rose-600` → Your gradient
- `bg-pink-50` → Your background
- `text-pink-700` → Your text color

---

## 🐛 Troubleshooting

### Chatbot Not Responding?
1. **Check Backend Server**: Must be running on port 5002
2. **Verify API Key**: GEMINI_API_KEY in .env should be valid
3. **Check Console**: Open browser DevTools for errors
4. **Test API**: Visit `http://localhost:5002/api/health`

### API Key Issues?
```
Error: API key not valid. Please pass a valid API key.
```
**Solution**: Get new key from https://makersuite.google.com/app/apikey

### Port Already in Use?
```
Error: listen EADDRINUSE: address already in use :::5002
```
**Solution**: 
```bash
# Windows
netstat -ano | findstr :5002
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5002 | xargs kill -9
```

### CORS Errors?
- Backend CORS is configured for `http://localhost:5173`
- If using different port, update in server.js

---

## 📈 Future Enhancements

### Planned Features
- [ ] Chat history save in database
- [ ] User authentication integration
- [ ] File/image upload support
- [ ] Multi-language selector (Hindi/English/Regional)
- [ ] Voice input/output
- [ ] Admin chat monitoring dashboard
- [ ] Chat analytics and insights
- [ ] Export chat history
- [ ] Typing status indicator
- [ ] Read receipts
- [ ] Emoji picker
- [ ] Rich media messages (cards, carousels)

### Database Integration
Create Chat model:
```javascript
const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    from: String,
    text: String,
    timestamp: Date
  }],
  sessionId: String,
  createdAt: { type: Date, default: Date.now }
});
```

---

## 🎓 How It Works

### Flow Diagram
```
User clicks chat button
    ↓
ChatBot.jsx opens chat window
    ↓
User types message or clicks quick reply
    ↓
Frontend sends POST to /api/chatbot
    ↓
Backend receives message
    ↓
Gemini AI processes with context
    ↓
AI generates Hinglish response
    ↓
Response sent back to frontend
    ↓
ChatBot.jsx displays bot message
```

### API Request Format
```javascript
POST http://localhost:5002/api/chatbot
Content-Type: application/json

{
  "message": "Design options dikhao"
}
```

### API Response Format
```javascript
{
  "success": true,
  "reply": "Bilkul! Humare paas ye design options hain:\n1. Traditional - ₹500-₹2000\n2. Modern - ₹800-₹3000..."
}
```

---

## 🌟 Best Practices

1. **Keep Prompts Updated** - Regularly update AI context with new products/prices
2. **Monitor Conversations** - Review chat logs for improvement areas
3. **Test Regularly** - Ensure API key and services are working
4. **Handle Errors Gracefully** - Show friendly error messages
5. **Optimize Performance** - Cache common responses if needed
6. **Secure API Keys** - Never commit .env to git
7. **Rate Limiting** - Consider adding rate limits to prevent abuse

---

## 📝 Important Notes

- **API Key**: Keep GEMINI_API_KEY secure and don't share
- **Port**: Backend uses 5002, Frontend uses 5173
- **CORS**: Configured for localhost development
- **Production**: Add rate limiting and authentication
- **Free Tier**: Gemini has usage limits on free tier

---

## ✨ Success!

Your chatbot is now fully functional with:
- ✅ Beautiful modern UI
- ✅ AI-powered responses
- ✅ Context awareness
- ✅ Hinglish support
- ✅ Quick replies
- ✅ Error handling
- ✅ Smooth animations

**Ready to chat!** Visit your website and click the pink chat button! 💬🎉
