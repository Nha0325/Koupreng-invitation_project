import AdminLayout from "../components/AdminLayout";

export default function Users() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage your users</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-gray-600">Users management page - Coming soon</p>
        </div>
      </div>
    </AdminLayout>
  );
}
