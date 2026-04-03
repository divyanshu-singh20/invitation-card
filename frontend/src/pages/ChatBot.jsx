import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showLanguageSelection, setShowLanguageSelection] = useState(true);
  const [chat, setChat] = useState([
    {
      from: "bot",
      text: "🙏 Welcome to Shadi Card! / शादी कार्ड में आपका स्वागत है!\n\nPlease select your preferred language:\nकृपया अपनी भाषा चुनें:"
    }
  ]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Language-specific messages
  const languageMessages = {
    hindi: {
      greeting: "नमस्ते! 🙏 मैं आपकी शादी कार्ड असिस्टेंट हूं। मैं आपकी मदद कर सकती हूं:\n\n• डिजाइन देखने में\n• प्राइसिंग जानने में\n• ऑर्डर प्रोसेस समझने में\n• डिलीवरी डिटेल्स में\n• कस्टम डिजाइन के बारे में\n\nक्या जानना चाहेंगे?",
      quickReplies: [
        "डिजाइन विकल्प दिखाएं",
        "कीमत क्या है?",
        "ऑर्डर कैसे करें?",
        "डिलीवरी का समय?",
        "कस्टम डिजाइन"
      ]
    },
    english: {
      greeting: "Hello! 👋 I'm your Wedding Card Assistant. I can help you with:\n\n• Design Options\n• Pricing Details\n• Order Process\n• Delivery Information\n• Custom Designs\n\nWhat would you like to know?",
      quickReplies: [
        "Show Design Options",
        "What's the Price?",
        "How to Order?",
        "Delivery Time?",
        "Custom Design?"
      ]
    },
    other: {
      greeting: "Namaste! 🙏 Main aapki wedding card assistant hoon. Main aapki help kar sakti hoon:\n\n• Design Options dekhne mein\n• Pricing janne mein\n• Order Process samajhne mein\n• Delivery details mein\n• Custom Design ke baare mein\n\nKya jaanna chahenge?",
      quickReplies: [
        "Design options dikhao",
        "Price kya hai?",
        "Order kaise kare?",
        "Delivery time?",
        "Custom design?"
      ]
    }
  };

  const [quickReplies, setQuickReplies] = useState([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const handleLanguageSelection = (lang) => {
    setSelectedLanguage(lang);
    setShowLanguageSelection(false);
    
    const langData = languageMessages[lang];
    setChat(prev => [...prev, 
      { from: "user", text: lang === 'hindi' ? 'हिंदी' : lang === 'english' ? 'English' : 'Other Languages' },
      { from: "bot", text: langData.greeting }
    ]);
    
    setQuickReplies(langData.quickReplies);
    setShowQuickReplies(true);
  };

  const sendMessage = async (text = message) => {
    if (!text.trim()) return;

    const userMsg = { from: "user", text };
    setChat(prev => [...prev, userMsg]);
    setMessage("");
    setLoading(true);
    setShowQuickReplies(false);

    try {
      const languageContext = selectedLanguage === 'hindi' 
        ? 'Reply in pure Hindi (Devanagari script)' 
        : selectedLanguage === 'english'
        ? 'Reply in English only'
        : 'Reply in Hinglish (Hindi + English mix)';

      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBaseUrl}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `${languageContext}. User query: ${text}` })
      });

      const data = await res.json();

      if (data.success) {
        setChat(prev => [...prev, { from: "bot", text: data.reply }]);
      } else {
        setChat(prev => [...prev, { 
          from: "bot", 
          text: "Sorry, kuch technical issue aa raha hai. Thodi der baad try karein." 
        }]);
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setChat(prev => [...prev, { 
        from: "bot", 
        text: "Connection issue hai 😕 Please check your internet aur phir se try karein." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white p-4 rounded-full shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 z-50 animate-pulse"
        aria-label="Open chat"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-pink-100 animate-slideUp">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="animate-spin-slow" size={20} />
              <div>
                <h3 className="font-bold text-lg">Shadi Card AI</h3>
                <p className="text-xs opacity-90">Wedding Card Expert</p>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-pink-50/30 to-white max-h-96 min-h-[300px]">
            {chat.map((c, i) => (
              <div key={i} className={`flex ${c.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-sm ${
                    c.from === "user"
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-pink-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{c.text}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-pink-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Language Selection */}
          {showLanguageSelection && (
            <div className="px-4 py-3 border-t border-pink-100 bg-pink-50/50">
              <p className="text-xs text-gray-700 mb-3 font-medium text-center">Select Your Language / अपनी भाषा चुनें</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleLanguageSelection('hindi')}
                  className="px-4 py-2.5 bg-white border-2 border-pink-300 text-pink-700 rounded-xl hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-200 shadow-sm font-medium"
                >
                  🇮🇳 हिंदी (Hindi)
                </button>
                <button
                  onClick={() => handleLanguageSelection('english')}
                  className="px-4 py-2.5 bg-white border-2 border-pink-300 text-pink-700 rounded-xl hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-200 shadow-sm font-medium"
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => handleLanguageSelection('other')}
                  className="px-4 py-2.5 bg-white border-2 border-pink-300 text-pink-700 rounded-xl hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-200 shadow-sm font-medium"
                >
                  🌐 Other Languages (Hinglish)
                </button>
              </div>
            </div>
          )}

          {/* Quick Replies */}
          {showQuickReplies && !showLanguageSelection && quickReplies.length > 0 && (
            <div className="px-4 py-2 border-t border-pink-100 bg-pink-50/50">
              <p className="text-xs text-gray-600 mb-2 font-medium">Quick Questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs px-3 py-1.5 bg-white border border-pink-200 text-pink-700 rounded-full hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-200 shadow-sm"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          {!showLanguageSelection && (
            <div className="p-4 border-t border-pink-100 bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  className="flex-1 border border-pink-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  placeholder="Type your message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !message.trim()}
                  className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
}
