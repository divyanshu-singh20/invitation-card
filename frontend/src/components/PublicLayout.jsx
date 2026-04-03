import ChatBot from "../pages/ChatBot";
import Footer from "./Footer";
import Header from "./Header";

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ChatBot /> {/* ✅ GLOBAL CHATBOT */}
    </div>
  );
}
