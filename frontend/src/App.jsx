import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import ChatBot from './pages/ChatBot';

// Public Pages
import CartPage from './pages/CartPage';
import CategoryListingPage from './pages/CategoryListingPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import CustomizePage from './pages/CustomizePage';
import DesignDetailsBySlug from './pages/DesignDetailsBySlug';
import DesignsPage from './pages/DesignsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import ShopRegisterPage from './pages/ShopRegisterPage';
import SignupPage from './pages/SignupPage';
import TrackOrderPage from './pages/TrackOrderPage';
import WishlistPage from './pages/WishlistPage';

import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';

// Admin Pages
import AdminCustomersPage from './pages/AdminCustomersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminDesignsPage from './pages/AdminDesignsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import AdminSellerProductsPage from './pages/AdminSellerProductsPage';
import AdminSellersPage from './pages/AdminSellersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';

// Seller Pages
import SellerAddProductPage from './pages/SellerAddProductPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import SellerForgotPasswordPage from './pages/SellerForgotPasswordPage';
import SellerLandingPage from './pages/SellerLandingPage';
import SellerLoginPage from './pages/SellerLoginPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import SellerProductsPage from './pages/SellerProductsPage';
import SellerProfilePage from './pages/SellerProfilePage';

/* ---------- Public Layout ---------- */
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
    <ChatBot />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>

        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />

        <Route path="/designs" element={<PublicLayout><DesignsPage /></PublicLayout>} />

        <Route path="/design/:slug" element={
          <PublicLayout><DesignDetailsBySlug /></PublicLayout>
        } />

        <Route path="/cards/:category" element={
          <PublicLayout><CategoryListingPage /></PublicLayout>
        } />

        <Route path="/category/:slug" element={
          <PublicLayout><CategoryPage /></PublicLayout>
        } />

        <Route path="/product/:slug" element={
          <PublicLayout><ProductDetailPage /></PublicLayout>
        } />

        <Route path="/customize/:designId" element={
          <PublicLayout><CustomizePage /></PublicLayout>
        } />

        <Route path="/checkout" element={
          <PublicLayout><CheckoutPage /></PublicLayout>
        } />

        <Route path="/order-success" element={
          <PublicLayout><OrderSuccessPage /></PublicLayout>
        } />

        <Route path="/track-order" element={
          <PublicLayout><TrackOrderPage /></PublicLayout>
        } />

        <Route path="/contact" element={
          <PublicLayout><ContactPage /></PublicLayout>
        } />

        <Route path="/login" element={
          <PublicLayout><LoginPage /></PublicLayout>
        } />

        <Route path="/signup" element={
          <PublicLayout><SignupPage /></PublicLayout>
        } />

        <Route path="/forgot-password" element={
          <PublicLayout><ForgotPasswordPage /></PublicLayout>
        } />

        <Route path="/my-orders" element={
          <PublicLayout><MyOrdersPage /></PublicLayout>
        } />

        <Route path="/cart" element={
          <PublicLayout><CartPage /></PublicLayout>
        } />

        <Route path="/wishlist" element={
          <PublicLayout><WishlistPage /></PublicLayout>
        } />

        <Route path="/profile" element={
          <PublicLayout><ProfilePage /></PublicLayout>
        } />

        <Route path="/shop-register" element={<ShopRegisterPage />} />

        {/* Seller Landing Page */}
        <Route path="/seller" element={<SellerLandingPage />} />

        {/* ---------- Admin Routes ---------- */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="/admin/designs" element={<AdminDesignsPage />} />
        <Route path="/admin/customers" element={<AdminCustomersPage />} />
        <Route path="/admin/customers/:id" element={<AdminCustomersPage />} />
        <Route path="/admin/payments" element={<AdminPaymentsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/sellers" element={<AdminSellersPage />} />
        <Route path="/admin/seller-products" element={<AdminSellerProductsPage />} />

        {/* ---------- Seller Routes ---------- */}
        <Route path="/seller/login" element={<SellerLoginPage />} />
        <Route path="/seller/forgot-password" element={<SellerForgotPasswordPage />} />
        <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
        <Route path="/seller/products" element={<SellerProductsPage />} />
        <Route path="/seller/products/add" element={<SellerAddProductPage />} />
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
        <Route path="/seller/profile" element={<SellerProfilePage />} />

      </Routes>
    </Router>
  );
}

export default App;
