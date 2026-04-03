import { useNavigate } from 'react-router-dom';
import menuData from '../data/menuData';

const HomeCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Horizontal Scrollable Category Row */}
        <div className="relative">
          {/* Left Gradient Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block"></div>

          {/* Category Items */}
          <div className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4 px-2">
            {menuData.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
              >
                {/* Circular Image */}
                <div
                  className={`relative w-20 h-20 md:w-24 md:h-24 ${category.bgColor} rounded-full overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-110 border-4 border-white`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>

                {/* Category Name */}
                <p className="mt-3 text-xs md:text-sm font-semibold text-gray-700 text-center max-w-[90px] leading-tight group-hover:text-primary-600 transition-colors">
                  {category.name}
                </p>
              </div>
            ))}
          </div>

          {/* Right Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block"></div>
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;
