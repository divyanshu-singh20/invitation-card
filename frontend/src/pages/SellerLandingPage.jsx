import {
  ArrowRight,
  Building,
  CheckCircle,
  DollarSign,
  FileText,
  Package,
  Shield,
  ShoppingBag,
  Star,
  TrendingUp,
  Upload,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SellerLandingPage = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-red-600">Shadi Card</span>
              </Link>
            </div>

            {/* Center - Navigation Links (Desktop only) */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('why-sell')}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Why Sell
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('requirements')}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Requirements
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                FAQ
              </button>
            </div>

            {/* Right - CTA Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to="/seller/login"
                className="px-4 py-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
              >
                Seller Login
              </Link>
              <Link
                to="/shop-register"
                className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-pink-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Sell Wedding Cards Online <span className="text-orange-600">Across India</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Join India's fastest-growing wedding card marketplace. Reach millions of customers, grow your business, and manage orders effortlessly—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/shop-register"
                className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-2"
              >
                Start Selling
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/seller/login"
                className="w-full sm:w-auto px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-all duration-200 text-lg"
              >
                Seller Login
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">10,000+</div>
                <div className="text-sm text-gray-600 mt-1">Active Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">50,000+</div>
                <div className="text-sm text-gray-600 mt-1">Monthly Orders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">All India</div>
                <div className="text-sm text-gray-600 mt-1">Delivery Network</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">₹0</div>
                <div className="text-sm text-gray-600 mt-1">Listing Fee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sell With Us */}
      <section id="why-sell" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Sell With Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to grow your wedding card business online
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Zero Listing Fee</h3>
              <p className="text-gray-600">
                Start selling without any upfront costs. List unlimited products for free.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pan-India Reach</h3>
              <p className="text-gray-600">
                Connect with customers from every corner of India. Grow beyond your local market.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Management</h3>
              <p className="text-gray-600">
                Simple dashboard to manage products, orders, and inventory in one place.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Get paid directly to your bank account. Timely and secure payment settlements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Sell */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Who Can Sell?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We welcome all wedding card professionals and businesses
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wedding Card Printers</h3>
              <p className="text-sm text-gray-600">
                Printing presses specializing in wedding invitations
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Invitation Designers</h3>
              <p className="text-sm text-gray-600">
                Creative professionals designing beautiful cards
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Printing Presses</h3>
              <p className="text-sm text-gray-600">
                Established printing businesses looking to expand
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Small Businesses</h3>
              <p className="text-sm text-gray-600">
                Card shops and manufacturers of all sizes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start selling in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Register as Seller</h3>
                <p className="text-gray-600">
                  Fill in your business details and complete a quick verification process
                </p>
              </div>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-orange-300" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Upload className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Designs</h3>
                <p className="text-gray-600">
                  Add your wedding card designs with images, pricing, and descriptions
                </p>
              </div>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-orange-300" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Receive Orders & Earn</h3>
                <p className="text-gray-600">
                  Get orders from customers nationwide and earn profits on every sale
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section id="requirements" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You Need to Get Started
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple requirements to become a seller
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Mobile Number</h3>
                    <p className="text-gray-600">For account verification and order notifications</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Bank Account Details</h3>
                    <p className="text-gray-600">To receive payments directly from us</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Shop/Business Details</h3>
                    <p className="text-gray-600">Basic information about your business and address</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      GST Number <span className="text-sm text-orange-600 font-normal">(Optional)</span>
                    </h3>
                    <p className="text-gray-600">Not mandatory, but recommended for registered businesses</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-blue-600 text-lg">ℹ️</span>
                  <span>
                    <strong>Quick Approval:</strong> Most seller accounts are approved within 24-48 hours after submitting complete details
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories/Testimonials */}
      <section id="testimonials" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join Thousands of Successful Sellers
            </h2>
            <p className="text-lg text-gray-600">
              See what our seller partners have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Within 3 months of joining, our sales increased by 300%. The platform is easy to use and customers are genuine."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                  RP
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Rajesh Printers</div>
                  <div className="text-sm text-gray-600">Delhi</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Best decision for my printing business. No commission fees and payments always on time. Highly recommend!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sharma Cards</div>
                  <div className="text-sm text-gray-600">Mumbai</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "From a local shop to nationwide reach. This platform transformed my small business into a thriving enterprise."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                  MK
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Modern Kreations</div>
                  <div className="text-sm text-gray-600">Bangalore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful wedding card sellers across India. Start your journey today—it's free, fast, and simple.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/shop-register"
              className="w-full sm:w-auto px-10 py-5 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl text-lg flex items-center justify-center gap-2"
            >
              Register as Seller Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-10 py-5 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-orange-600 transition-all duration-200 text-lg"
            >
              Contact Support
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-orange-100">
            Have questions? Call us at <span className="font-semibold text-white">1800-123-4567</span> or email{' '}
            <span className="font-semibold text-white">sellers@weddingcards.com</span>
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <details className="bg-white rounded-lg shadow-sm p-6 group">
              <summary className="font-semibold text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                Is there any fee to register as a seller?
                <span className="text-orange-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                No, registration is completely free. There are no listing fees, membership charges, or hidden costs. You only pay a small commission on successful sales.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-6 group">
              <summary className="font-semibold text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                How long does the approval process take?
                <span className="text-orange-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Most seller accounts are approved within 24-48 hours after you submit all required documents and business details.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-6 group">
              <summary className="font-semibold text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                Do I need GST registration to sell?
                <span className="text-orange-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                GST registration is optional but recommended. You can start selling without GST, but having it helps build customer trust and is required for certain order values.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-6 group">
              <summary className="font-semibold text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                When will I receive my payment?
                <span className="text-orange-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Payments are processed after order delivery confirmation. Typically, funds are transferred to your registered bank account within 7-10 business days.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-6 group">
              <summary className="font-semibold text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                Can I manage my shop from mobile?
                <span className="text-orange-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Yes! Our seller dashboard is fully mobile-responsive. You can manage products, view orders, and track sales from any device, anywhere.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellerLandingPage;
