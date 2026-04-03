import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DesignCard from '../components/DesignCard';
import Loader from '../components/Loader';
import { designService } from '../services/api.service';

const DesignsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    paperType: '',
    color: ''
  });

  useEffect(() => {
    fetchDesigns();
  }, [filters]);

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const response = await designService.getDesigns(filters);
      setDesigns(response.data);
    } catch (error) {
      // Error fetching designs
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      paperType: '',
      color: ''
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Wedding Invitation Designs
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="label">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  <option value="hindu">Hindu Wedding</option>
                  <option value="muslim">Muslim Wedding</option>
                  <option value="christian">Christian Wedding</option>
                  <option value="modern">Modern / Minimal</option>
                  <option value="traditional">Traditional</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="label">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Paper Type */}
              <div className="mb-6">
                <label className="label">Paper Type</label>
                <select
                  value={filters.paperType}
                  onChange={(e) => handleFilterChange('paperType', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
          </div>

          {/* Designs Grid */}
          <div className="flex-1">
            <div className="mb-4 text-gray-600">
              {designs.length} design(s) found
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : designs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map(design => (
                  <DesignCard key={design._id} design={design} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No designs found matching your filters.</p>
                <button onClick={clearFilters} className="btn-primary mt-4">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignsPage;
