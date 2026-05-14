/**
 * ClassicTemplate
 * 
 * Classic wedding invitation template with elegant design.
 * 
 * @param {Object} data - Event data
 */
export default function ClassicTemplate({ data }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4">
            {data.groomName} & {data.brideName}
          </h1>
          <p className="text-xl text-gray-600">Request the pleasure of your company</p>
        </div>

        {/* Date & Location */}
        <div className="text-center mb-12">
          <p className="text-2xl font-semibold mb-2">{data.date}</p>
          <p className="text-lg text-gray-600">{data.location}</p>
        </div>

        {/* Story */}
        {data.story && (
          <div className="mb-12">
            <p className="text-center text-gray-700 leading-relaxed">
              {data.story}
            </p>
          </div>
        )}

        {/* Schedule */}
        {data.schedule && data.schedule.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-center mb-6">Schedule</h2>
            <div className="space-y-4">
              {data.schedule.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="font-semibold">{item.time}</p>
                  <p className="text-gray-600">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p className="text-sm">RSVP by contacting the couple</p>
        </div>
      </div>
    </div>
  );
}
