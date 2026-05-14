/**
 * ModernTemplate
 * 
 * Modern wedding invitation template with clean design.
 * 
 * @param {Object} data - Event data
 */
export default function ModernTemplate({ data }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">
            {data.groomName}
            <span className="text-gray-400 mx-4">&</span>
            {data.brideName}
          </h1>
          <p className="text-xl text-gray-600 uppercase tracking-widest">
            Are Getting Married
          </p>
        </div>

        {/* Date Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <p className="text-3xl font-bold mb-2">{data.date}</p>
            <p className="text-gray-600">{data.location}</p>
          </div>
        </div>

        {/* Story */}
        {data.story && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">{data.story}</p>
          </div>
        )}

        {/* Schedule */}
        {data.schedule && data.schedule.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Wedding Schedule</h2>
            <div className="space-y-4">
              {data.schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <span className="font-semibold">{item.time}</span>
                  <span className="text-gray-600">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
