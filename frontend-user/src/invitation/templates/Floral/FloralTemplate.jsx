/**
 * FloralTemplate
 * 
 * Floral wedding invitation template with romantic design.
 * 
 * @param {Object} data - Event data
 */
export default function FloralTemplate({ data }) {
  return (
    <div className="min-h-screen bg-pink-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Decorative Elements */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌸</div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-pink-600 mb-4">
            Together with their families
          </p>
          <h1 className="text-5xl font-serif mb-4 text-pink-800">
            {data.groomName} & {data.brideName}
          </h1>
          <p className="text-xl text-pink-600">Invite you to celebrate</p>
        </div>

        {/* Date & Location */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-4 border-pink-200">
          <div className="text-center">
            <p className="text-3xl font-bold mb-2 text-pink-700">{data.date}</p>
            <p className="text-gray-600">{data.location}</p>
          </div>
        </div>

        {/* Story */}
        {data.story && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-serif text-center mb-4 text-pink-700">
              Our Love Story
            </h2>
            <p className="text-gray-700 leading-relaxed text-center">
              {data.story}
            </p>
          </div>
        )}

        {/* Schedule */}
        {data.schedule && data.schedule.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-4 border-pink-200">
            <h2 className="text-2xl font-serif text-center mb-6 text-pink-700">
              Wedding Day
            </h2>
            <div className="space-y-4">
              {data.schedule.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="font-semibold text-pink-600">{item.time}</p>
                  <p className="text-gray-600">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-pink-600">
          <div className="text-4xl mb-4">🌸</div>
          <p className="text-sm">RSVP by contacting the couple</p>
        </div>
      </div>
    </div>
  );
}
