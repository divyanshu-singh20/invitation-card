import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { designService } from '../services/api.service';
import { getImageUrl } from '../utils/api';

const FeaturedScroller = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await designService.getDesigns({ featured: true });
        // support both shapes: res.data or res
        const data = res?.data || res || [];
        if (mounted) setDesigns(data.slice ? data.slice(0, 8) : []);
      } catch (err) {
        // Error fetching featured designs
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  if (loading) return null;
  if (!designs || designs.length === 0) return null;

  return (
    <section className="bg-white py-3 border-t border-b border-gray-100">
      <div className="container mx-auto px-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Featured Designs</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {designs.map((d) => {
            const img = getImageUrl(d.images?.[0]?.url || d.images?.[0]);
            return (
              <div
                key={d._id || d.id || d.slug || img}
                className="flex-shrink-0 w-44 bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
                onClick={() => navigate(`/design/${d._id || d.id}`)}
              >
                <div className="h-28 bg-gray-100 overflow-hidden">
                  <img src={img} alt={d.title || d.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-gray-800 line-clamp-2">{d.title || d.name}</div>
                  <div className="text-xs text-gray-500 mt-1">₹{d.basePrice || d.price || '—'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedScroller;
