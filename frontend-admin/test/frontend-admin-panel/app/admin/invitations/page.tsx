"use client";

import AdminGuard from "@/components/AdminGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Search, Copy, Trash2, Eye } from "lucide-react";
import { useState } from "react";

const mockInvitations = [
  {
    id: 1,
    recipient: "john.doe@example.com",
    status: "accepted",
    createdAt: "2024-05-10",
    expiresAt: "2024-06-10",
    link: "https://koupreng.com/invite/abc123",
  },
  {
    id: 2,
    recipient: "jane.smith@example.com",
    status: "pending",
    createdAt: "2024-05-09",
    expiresAt: "2024-06-09",
    link: "https://koupreng.com/invite/def456",
  },
  {
    id: 3,
    recipient: "bob.wilson@example.com",
    status: "declined",
    createdAt: "2024-05-08",
    expiresAt: "2024-06-08",
    link: "https://koupreng.com/invite/ghi789",
  },
  {
    id: 4,
    recipient: "alice.johnson@example.com",
    status: "accepted",
    createdAt: "2024-05-07",
    expiresAt: "2024-06-07",
    link: "https://koupreng.com/invite/jkl012",
  },
];

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState(mockInvitations);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch =
      inv.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.link.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    setInvitations(invitations.filter((inv) => inv.id !== id));
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invitations</h1>
              <p className="text-gray-600 mt-2">Manage invitation links and tracking</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              <Plus className="w-5 h-5" />
              Create Invitation
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or link..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {/* Invitations Table */}
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvitations.map((invitation) => (
                    <tr
                      key={invitation.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {invitation.recipient}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            invitation.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : invitation.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {invitation.status.charAt(0).toUpperCase() +
                            invitation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {invitation.createdAt}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {invitation.expiresAt}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCopyLink(invitation.link)}
                            className="p-1 hover:bg-gray-200 rounded transition"
                            title="Copy link"
                          >
                            <Copy className="w-4 h-4 text-gray-600" />
                          </button>
                          <a
                            href="#"
                            className="p-1 hover:bg-gray-200 rounded transition"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </a>
                          <button
                            onClick={() => handleDelete(invitation.id)}
                            className="p-1 hover:bg-red-100 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInvitations.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No invitations found</p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
