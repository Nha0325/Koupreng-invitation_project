import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { invitationService } from '../../shared/services/invitationService';

const MyInvitationsPage = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        const res = await invitationService.getMyInvitations();
        setInvitations(res.data || []);
      } catch {
        setInvitations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await invitationService.deleteInvitation(id);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch {
      // Delete failed silently
    }
  };

  const handleCopyLink = (shareToken) => {
    if (!shareToken) return;
    const url = `${window.location.origin}/preview/${shareToken}`;
    navigator.clipboard.writeText(url);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Invitations</h1>
          <p className="text-gray-500">Manage your saved invitation designs</p>
        </div>
        <button
          onClick={() => navigate('/invitation-templates')}
          className="px-4 py-2 bg-[#c8a96e] text-white rounded-lg text-sm font-medium hover:bg-[#b8994e] transition-colors"
        >
          + Create New
        </button>
      </div>

      {invitations.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📨</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No invitations yet</h2>
          <p className="text-gray-400 mb-6">Start by choosing a template and creating your first invitation</p>
          <button
            onClick={() => navigate('/invitation-templates')}
            className="px-6 py-3 bg-[#c8a96e] text-white rounded-lg font-medium hover:bg-[#b8994e] transition-colors"
          >
            Browse Templates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((inv) => (
            <motion.div
              key={inv.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {inv.thumbnailDataUrl ? (
                  <img src={inv.thumbnailDataUrl} alt={inv.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">📄</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{inv.title}</h3>
                <p className="text-xs text-gray-400 mb-3">
                  Created {new Date(inv.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/designer/edit?id=${inv.id}`)}
                    className="flex-1 py-1.5 text-xs bg-[#c8a96e] text-white rounded-lg hover:bg-[#b8994e] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/preview/${inv.id}`)}
                    className="flex-1 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleCopyLink(inv.shareToken)}
                    disabled={!inv.shareToken}
                    className="py-1.5 px-2 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Copy Share Link"
                  >
                    🔗
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="py-1.5 px-2 text-xs border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInvitationsPage;
