// Chat (AI Chatbot) Controller
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false,
        error: "Message required" 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an AI assistant for "Shadi Card" - A Premium Wedding Invitation Platform.

CONTEXT:
- Custom & pre-designed wedding cards
- Digital + Physical printing
- Salon booking services
- Prices: ₹300-₹8000 based on category
- Express delivery: 2-3 days
- Standard delivery: 5-7 days

Reply in Hinglish (conversational, friendly).
Help with: designs, pricing, orders, customization.

USER: ${message}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ 
      success: true,
      reply 
    });

  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      reply: "Technical issue hai, please try again."
    });
  }
};
