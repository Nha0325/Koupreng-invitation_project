"use client";

import AdminGuard from "@/components/AdminGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Mail, Users, FileText, TrendingUp } from "lucide-react";

const dashboardData = [
  { month: "Jan", invitations: 400, users: 240 },
  { month: "Feb", invitations: 520, users: 290 },
  { month: "Mar", invitations: 480, users: 310 },
  { month: "Apr", invitations: 650, users: 380 },
  { month: "May", invitations: 720, users: 420 },
  { month: "Jun", invitations: 890, users: 510 },
];

const stats = [
  {
    title: "Total Invitations",
    value: "2,345",
    change: "+12.5%",
    icon: Mail,
    color: "bg-blue-500",
  },
  {
    title: "Active Users",
    value: "1,289",
    change: "+8.2%",
    icon: Users,
    color: "bg-green-500",
  },
  {
    title: "Templates",
    value: "24",
    change: "+2",
    icon: FileText,
    color: "bg-purple-500",
  },
  {
    title: "Conversion Rate",
    value: "68.5%",
    change: "+3.1%",
    icon: TrendingUp,
    color: "bg-orange-500",
  },
];

const recentInvitations = [
  {
    id: 1,
    recipient: "john@example.com",
    status: "accepted",
    createdAt: "2024-05-10",
  },
  {
    id: 2,
    recipient: "jane@example.com",
    status: "pending",
    createdAt: "2024-05-09",
  },
  {
    id: 3,
    recipient: "bob@example.com",
    status: "declined",
    createdAt: "2024-05-08",
  },
  {
    id: 4,
    recipient: "alice@example.com",
    status: "accepted",
    createdAt: "2024-05-07",
  },
];

export default function Dashboard() {
  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-white rounded-lg shadow p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 text-sm font-medium">
                      {stat.title}
                    </h3>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <span className="text-green-600 text-sm font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invitations Chart */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Invitations Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="invitations"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Users Chart */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                User Growth
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Invitations */}
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
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
