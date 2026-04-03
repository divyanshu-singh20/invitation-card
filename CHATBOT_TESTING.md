# 🧪 Chatbot Testing Instructions

## Pre-Testing Checklist

### 1. API Key Setup ✅
```bash
# Check if GEMINI_API_KEY exists in backend/.env
cd backend
cat .env | grep GEMINI_API_KEY
```

**Current Status**: ✅ Already configured
- API Key: `AIzaSyAUET5k9HUnex93CAAsEdMkxPLXD-fFDhg`

### 2. Start Backend Server
```bash
cd backend
npm run dev
```
Expected Output:
```
🔥 Server running on port 5002
MongoDB Connected Successfully
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```
Expected Output:
```
VITE v5.x.x ready in XXX ms
➜ Local: http://localhost:5173/
```

---

## 🎯 Testing Steps

### Test 1: Basic Chat Functionality
1. Open browser: `http://localhost:5173`
2. Look for pink floating button (bottom-right corner)
3. Click the button - chat window should slide up
4. Type "Hello" and press Enter
5. ✅ **Expected**: Bot responds in Hinglish within 2-3 seconds

### Test 2: Quick Reply Buttons
1. Click chat button to open
2. See 5 quick reply buttons:
   - "Design options dikhao"
   - "Price kya hai?"
   - "Order kaise kare?"
   - "Delivery time?"
   - "Custom design possible hai?"
3. Click any button
4. ✅ **Expected**: Message sent automatically, bot responds with relevant info

### Test 3: Context-Aware Responses
**Test Questions**:
```
❓ "Wedding card ki price kya hai?"
✅ Expected: Bot provides ₹300-₹8000 range with categories

❓ "Delivery kitne din mein hogi?"
✅ Expected: Express (2-3 days), Standard (5-7 days)

❓ "Custom design bana sakte ho?"
✅ Expected: Yes, starting ₹1500, free consultation

❓ "Bulk order par discount milega?"
✅ Expected: Yes, for 50+ cards

❓ "Salon booking kaise kare?"
✅ Expected: Explains salon service booking process
```

### Test 4: Error Handling
**Test Scenarios**:

1. **Stop Backend Server**
   - Send message
   - ✅ Expected: "Connection issue hai 😕 Please check your internet..."

2. **Invalid API Key** (Don't actually test this)
   - Backend will return error
   - ✅ Expected: Fallback message shown

3. **Empty Message**
   - Try to send empty/spaces-only message
   - ✅ Expected: Nothing happens, button disabled

### Test 5: UI/UX Features
1. **Auto-scroll**: Send multiple messages, should auto-scroll to latest
2. **Loading indicator**: Check for bouncing dots while bot is typing
3. **Keyboard shortcut**: Press Enter to send, Shift+Enter for new line
4. **Responsive**: Test on mobile view (DevTools → Toggle device toolbar)
5. **Animations**: 
   - Slide-up when opening
   - Pulse animation on floating button
   - Smooth message transitions

### Test 6: Multiple Conversations
1. Send a message
2. Wait for response
3. Send another related question
4. ✅ Expected: Bot maintains context and responds appropriately

---

## 🔍 API Testing (Optional)

### Using cURL
```bash
# Test chatbot endpoint
curl -X POST http://localhost:5002/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Price kya hai?"}'
```

Expected Response:
```json
{
  "success": true,
  "reply": "Shadi Card ke designs ki pricing kuch is tarah hai:\n1. Traditional Wedding Cards - ₹500-₹2000\n..."
}
```

### Using Postman
1. Method: POST
2. URL: `http://localhost:5002/api/chatbot`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "message": "Design options dikhao"
}
```

---

## 📊 Expected Results Summary

| Test | Status | Notes |
|------|--------|-------|
| Backend Running | ✅ | Port 5002 |
| Frontend Running | ✅ | Port 5173 |
| Chat Button Visible | ✅ | Bottom-right, pink |
| Chat Window Opens | ✅ | Slides up smoothly |
| Send Message | ✅ | API call successful |
| Bot Response | ✅ | Hinglish, context-aware |
| Quick Replies | ✅ | 5 buttons work |
| Loading State | ✅ | Animated dots |
| Auto-scroll | ✅ | To latest message |
| Error Handling | ✅ | Graceful fallbacks |
| Mobile Responsive | ✅ | Works on all sizes |

---

## 🐛 Common Issues & Solutions

### Issue 1: Chat button not visible
**Solution**: Check PublicLayout.jsx includes ChatBot component

### Issue 2: "Cannot read property 'text' of undefined"
**Solution**: Backend not running or API key invalid

### Issue 3: CORS error in console
**Solution**: Ensure backend CORS allows frontend URL

### Issue 4: "Module not found: lucide-react"
**Solution**: 
```bash
cd frontend
npm install lucide-react
```

### Issue 5: Messages not scrolling
**Solution**: Already fixed with `chatEndRef` and `scrollIntoView`

---

## ✅ Final Checklist

Before marking as complete:
- [ ] Backend server running on 5002
- [ ] Frontend running on 5173
- [ ] Chat button visible and clickable
- [ ] Chat window opens/closes smoothly
- [ ] Can send messages successfully
- [ ] Bot responds within 3-5 seconds
- [ ] Quick replies work
- [ ] Hinglish responses received
- [ ] Context-aware answers (pricing, delivery, etc.)
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] No console errors

---

## 🎉 Success Criteria

**Chatbot is successfully implemented when**:
1. ✅ User can open chat from any public page
2. ✅ Bot responds to questions in Hinglish
3. ✅ Provides accurate pricing information
4. ✅ Explains order process clearly
5. ✅ Quick replies work instantly
6. ✅ Handles errors gracefully
7. ✅ UI is beautiful and responsive
8. ✅ No performance issues

---

## 📸 Screenshots to Verify

1. **Floating Button**: Pink gradient button bottom-right
2. **Closed State**: Just button visible
3. **Opened State**: Full chat window with header
4. **Quick Replies**: 5 button options visible
5. **Conversation**: Mix of user (pink) and bot (white) messages
6. **Loading State**: Bouncing dots animation
7. **Mobile View**: Responsive layout on small screen

---

## 🚀 Next Steps After Testing

If all tests pass:
1. ✅ Mark chatbot as **Production Ready**
2. 📝 Document any custom prompts needed
3. 🔒 Secure API key for production
4. 📊 Add analytics tracking (optional)
5. 💾 Consider database integration for chat history
6. 🎨 Customize quick replies based on analytics
7. 🌐 Add multi-language support

---

**Happy Testing! 🧪✨**

Need help? Check [CHATBOT_IMPLEMENTATION.md](./CHATBOT_IMPLEMENTATION.md) for detailed docs.
