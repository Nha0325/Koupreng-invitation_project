import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import templates, { categories, eventTypes } from '../data/templates';

const TemplateGallery = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeEventType, setActiveEventType] = useState('all');

  const filtered = templates.filter((t) => {
    const catMatch = activeCategory === 'All' || t.category === activeCategory;
    const eventMatch = activeEventType === 'all' || t.eventType === activeEventType;
    return catMatch && eventMatch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Gallery</h1>
        <p className="text-gray-500">Choose a template to start designing your invitation</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-[#c8a96e] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#c8a96e] hover:text-[#c8a96e]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event Type Filter */}
      <div className="mb-6">
        <select
          value={activeEventType}
          onChange={(e) => setActiveEventType(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#c8a96e]"
        >
          {eventTypes.map((et) => (
            <option key={et} value={et}>
              {et === 'all' ? 'All Event Types' : et.charAt(0).toUpperCase() + et.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 40px rgba(200,169,110,0.2)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer"
            onClick={() => navigate(`/designer/${template.id}`)}
          >
            {/* Preview Area */}
            <div
              className="h-48 flex items-center justify-center relative"
              style={{ backgroundColor: template.colors.primary }}
            >
              <span className="text-5xl">{template.thumbnail}</span>
              <span
                className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: template.colors.secondary + '33',
                  color: template.colors.secondary,
                }}
              >
                {template.category}
              </span>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{template.nameKh}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 capitalize">{template.eventType}</span>
                <button
                  className="px-3 py-1.5 bg-[#c8a96e] text-white text-sm rounded-lg font-medium hover:bg-[#b8994e] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/designer/${template.id}`);
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No templates found for this filter combination.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
