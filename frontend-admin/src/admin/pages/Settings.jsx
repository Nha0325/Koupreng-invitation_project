import AdminLayout from "../components/AdminLayout";

export default function Settings() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your settings</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-gray-600">Settings page - Coming soon</p>
        </div>
      </div>
    </AdminLayout>
  );
}
