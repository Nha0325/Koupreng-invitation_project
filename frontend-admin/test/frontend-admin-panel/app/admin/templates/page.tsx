"use client";

import AdminGuard from "@/components/AdminGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Search, Edit2, Trash2, Eye, X, Upload, AlertCircle } from "lucide-react";
import { useState } from "react";

const mockTemplates = [
  {
    id: 1,
    name: "Wedding Invitation",
    description: "Elegant wedding invitation template",
    category: "wedding",
    createdAt: "2024-05-01",
    used: 45,
    imageUrl: "https://via.placeholder.com/300x200?text=Wedding",
  },
  {
    id: 2,
    name: "Corporate Event",
    description: "Professional corporate event invitation",
    category: "corporate",
    createdAt: "2024-04-25",
    used: 23,
    imageUrl: "https://via.placeholder.com/300x200?text=Corporate",
  },
  {
    id: 3,
    name: "Birthday Party",
    description: "Fun and colorful birthday invitation",
    category: "party",
    createdAt: "2024-04-20",
    used: 89,
    imageUrl: "https://via.placeholder.com/300x200?text=Birthday",
  },
  {
    id: 4,
    name: "Conference",
    description: "Professional conference invitation",
    category: "corporate",
    createdAt: "2024-04-15",
    used: 12,
    imageUrl: "https://via.placeholder.com/300x200?text=Conference",
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    category: "wedding",
    file: null as File | null,
  });
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "wedding",
  });

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    if (!uploadForm.name || !uploadForm.file) {
      alert("Please fill all required fields");
      return;
    }
    const newTemplate = {
      id: Math.max(...templates.map(t => t.id), 0) + 1,
      name: uploadForm.name,
      description: uploadForm.description,
      category: uploadForm.category,
      createdAt: new Date().toISOString().split("T")[0],
      used: 0,
      imageUrl: URL.createObjectURL(uploadForm.file),
    };
    setTemplates([newTemplate, ...templates]);
    setShowUploadModal(false);
    setUploadForm({ name: "", description: "", category: "wedding", file: null });
  };

  const handleOpenEdit = (template: any) => {
    setSelectedTemplate(template);
    setEditForm({
      name: template.name,
      description: template.description,
      category: template.category,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editForm.name) {
      alert("Template name is required");
      return;
    }
    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id
          ? { ...t, ...editForm }
          : t
      )
    );
    setShowEditModal(false);
  };

  const handleDelete = (template: any) => {
    setSelectedTemplate(template);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setTemplates(templates.filter((t) => t.id !== selectedTemplate.id));
    setShowDeleteModal(false);
  };

  const categories = ["wedding", "corporate", "party", "birthday", "graduation", "conference"];

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
              <p className="text-gray-600 mt-2">Manage and customize invitation templates</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              <Plus className="w-5 h-5" />
              Upload Template
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden hover:shadow-lg transition"
              >
                {/* Template Preview */}
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded capitalize">
                      {template.category}
                    </span>
                    <span className="font-semibold text-gray-700">
                      Used {template.used}x
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowPreviewModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm transition"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleOpenEdit(template)}
                      className="flex items-center justify-center px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 text-sm transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template)}
                      className="flex items-center justify-center px-3 py-2 bg-red-100 hover:bg-red-200 rounded text-red-700 text-sm transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No templates found</p>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Upload Template</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.name}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Modern Wedding"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Describe this template..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setUploadForm({
                          ...uploadForm,
                          file: e.target.files?.[0] || null,
                        })
                      }
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {uploadForm.file
                          ? uploadForm.file.name
                          : "Click to upload or drag and drop"}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreviewModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedTemplate.name}
                </h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <img
                src={selectedTemplate.imageUrl}
                alt={selectedTemplate.name}
                className="w-full h-96 object-cover rounded-lg mb-4"
              />

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Description:</strong> {selectedTemplate.description}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {selectedTemplate.category.charAt(0).toUpperCase() +
                    selectedTemplate.category.slice(1)}
                </p>
                <p>
                  <strong>Created:</strong> {selectedTemplate.createdAt}
                </p>
                <p>
                  <strong>Used:</strong> {selectedTemplate.used} times
                </p>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleOpenEdit(selectedTemplate);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Edit Template
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Edit Template</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Delete Template?
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete &quot;{selectedTemplate.name}&quot;? This
                action cannot be undone.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminGuard>
  );
}
