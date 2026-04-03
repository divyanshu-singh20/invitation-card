import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/crousal%20image/Gemini_Generated_Image_2c57fx2c57fx2c57.png',
      title: 'Premium Wedding Card Printing',
      subtitle: 'Elegant designs for your special day - Custom printing delivered to your doorstep',
      buttonText: 'Browse Wedding Cards'
    },
    {
      id: 2,
      image: '/crousal%20image/Gemini_Generated_Image_33iqji33iqji33iq.png',
      title: 'Business Printing Solutions',
      subtitle: 'Professional business cards, brochures & corporate materials',
      buttonText: 'Business Printing'
    },
    {
      id: 3,
      image: '/crousal%20image/Gemini_Generated_Image_3xqdld3xqdld3xqd.png',
      title: 'Custom Banner Printing',
      subtitle: 'Eye-catching banners for events, promotions and celebrations',
      buttonText: 'Order Banners'
    },
    {
      id: 4,
      image: '/crousal%20image/Gemini_Generated_Image_668rzz668rzz668r.png',
      title: 'Birthday Invitation Cards',
      subtitle: 'Colorful and creative designs for memorable birthday celebrations',
      buttonText: 'Birthday Cards'
    },
    {
      id: 5,
      image: '/crousal%20image/Gemini_Generated_Image_ildl6oildl6oildl.png',
      title: 'Anniversary Special Prints',
      subtitle: 'Celebrate love with beautifully crafted anniversary cards & gifts',
      buttonText: 'Anniversary Designs'
    },
    {
      id: 6,
      image: '/crousal%20image/Gemini_Generated_Image_lfaqnhlfaqnhlfaq.png',
      title: 'Corporate Event Materials',
      subtitle: 'Conference materials, name badges, and event signage',
      buttonText: 'Event Printing'
    },
    {
      id: 7,
      image: '/crousal%20image/Gemini_Generated_Image_pno1q8pno1q8pno1.png',
      title: 'Photo Prints & Albums',
      subtitle: 'High-quality photo printing for memories that last forever',
      buttonText: 'Photo Services'
    },
    {
      id: 8,
      image: '/crousal%20image/Gemini_Generated_Image_rh5yt7rh5yt7rh5y.png',
      title: 'Festival Greeting Cards',
      subtitle: 'Traditional & modern designs for all festive occasions',
      buttonText: 'Festival Cards'
    },
    {
      id: 9,
      image: '/crousal%20image/Gemini_Generated_Image_z0sgz1z0sgz1z0sg.png',
      title: 'Marketing Materials',
      subtitle: 'Flyers, posters & promotional materials to grow your business',
      buttonText: 'Marketing Prints'
    },
    {
      id: 10,
      image: '/crousal%20image/Gemini_Generated_Image_ildl6oildl6oildl.png',
      title: 'Join Our Community',
      subtitle: 'Create an account to get exclusive offers, track orders, and enjoy personalized recommendations',
      buttonText: 'Sign Up Now',
      link: '/signup'
    },
    {
      id: 11,
      image: '/crousal%20image/Gemini_Generated_Image_2c57fx2c57fx2c57.png',
      title: 'Become a Seller',
      subtitle: 'Join our platform and showcase your printing services to thousands of customers',
      buttonText: 'Start Selling',
      link: '/seller'
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-3xl mx-auto animate-fadeIn">
              {slide.subtitle}
            </p>
            <button
              onClick={() => navigate(slide.link || '/designs')}
              className="inline-block bg-white text-red-600 px-10 py-4 rounded-full font-semibold text-lg hover:bg-red-50 transition-all duration-300 hover:scale-105 shadow-xl animate-fadeIn"
            >
              {slide.buttonText}
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 group"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
