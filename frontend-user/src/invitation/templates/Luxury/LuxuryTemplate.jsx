/**
 * LuxuryTemplate
 * 
 * Luxury wedding invitation template with premium design.
 * Uses the primary color from event data.
 * 
 * @param {Object} data - Event data
 */
export default function LuxuryTemplate({ data }) {
  const primaryColor = data.colors?.primary || "#7033ff";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
              Wedding Invitation
            </p>
            <h1 className="text-5xl font-serif mb-6">
              {data.groomName} & {data.brideName}
            </h1>
            <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: primaryColor }} />
            <p className="text-xl text-gray-600">
              Request the honour of your presence
            </p>
          </div>

          {/* Date & Location */}
          <div className="text-center mb-12">
            <p className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
              {data.date}
            </p>
            <p className="text-lg text-gray-600">{data.location}</p>
          </div>

          {/* Story */}
          {data.story && (
            <div className="mb-12 text-center">
              <p className="text-gray-700 leading-relaxed italic">
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
                    <p className="font-semibold" style={{ color: primaryColor }}>
                      {item.time}
                    </p>
                    <p className="text-gray-600">{item.event}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-gray-600">
            <p className="text-sm">Kindly respond by [RSVP Date]</p>
          </div>
        </div>
      </div>
    </div>
  );
}
