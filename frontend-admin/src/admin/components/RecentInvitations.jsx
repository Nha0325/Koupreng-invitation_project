const recentInvitations = [
  {
    id: 1,
    recipient: 'john@example.com',
    status: 'accepted',
    createdAt: '2024-05-10',
  },
  {
    id: 2,
    recipient: 'jane@example.com',
    status: 'pending',
    createdAt: '2024-05-09',
  },
  {
    id: 3,
    recipient: 'bob@example.com',
    status: 'declined',
    createdAt: '2024-05-08',
  },
  {
    id: 4,
    recipient: 'alice@example.com',
    status: 'accepted',
    createdAt: '2024-05-07',
  },
];

export default function RecentInvitations() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Invitations
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentInvitations.map((invitation) => (
              <tr key={invitation.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {invitation.recipient}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invitation.status === 'accepted'
                        ? 'bg-green-100 text-green-700'
                        : invitation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {invitation.status.charAt(0).toUpperCase() +
                      invitation.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {invitation.createdAt}
                </td>
                <td className="px-6 py-4 text-sm">
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
