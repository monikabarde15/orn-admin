import React, { useEffect, useState } from "react";
import api from "../services/api";

const API_BASE = "/api/v1/category";

const AdminCategoryPanel = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  /* ================= Reset ================= */

  const resetForm = () => {
    setSelectedCategory(null);
    setName("");
    setDescription("");
    setError("");
  };

  /* ================= Load Categories ================= */

  const loadCategories = async () => {
    setLoading(true);

    try {
      const res = await api.get(
        `${API_BASE}/showAllCategories`
      );

      setCategories(res.data.data || []);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================= Open Category ================= */

  const openCategory = (cat: any) => {
    setSelectedCategory(cat);

    setName(cat.name || "");
    setDescription(cat.description || "");
  };

  /* ================= Save Category ================= */

  const saveCategory = async () => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        name,
        description,
      };

      if (selectedCategory) {
        await api.put(
          `${API_BASE}/updateCategory/${selectedCategory._id}`,
          payload
        );
      } else {
        await api.post(
          `${API_BASE}/createCategory`,
          payload
        );
      }

      resetForm();
      loadCategories();
    } catch (err) {
      setError("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  /* ================= Delete Category ================= */

  const deleteCategory = async () => {
    if (!selectedCategory) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this category?"
      )
    )
      return;

    setDeleting(true);

    try {
      await api.delete(
        `${API_BASE}/deleteCategory/${selectedCategory._id}`
      );

      resetForm();
      loadCategories();
    } catch (err) {
      setError("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[85vh] bg-gray-100 rounded-lg shadow overflow-hidden">

      {/* ================= Sidebar ================= */}

      <div className="w-full md:w-1/3 bg-white border-r flex flex-col">

        <div className="p-4 font-semibold text-lg bg-blue-50 text-blue-700">
          📂 Category Management
        </div>

        {loading ? (
          <div className="p-4 text-center">
            Loading...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No categories found
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">

            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => openCategory(cat)}
                className={`p-4 cursor-pointer border-b ${
                  selectedCategory?._id === cat._id
                    ? "bg-blue-100"
                    : "hover:bg-blue-50"
                }`}
              >
                <div className="font-semibold">
                  {cat.name}
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  {cat.description}
                </div>
              </div>
            ))}

          </div>
        )}

        <button
          onClick={resetForm}
          className="m-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          + Add New Category
        </button>
      </div>

      {/* ================= Form ================= */}

      <div className="flex-1 flex flex-col bg-gray-50">

        <div className="p-4 bg-white border-b flex justify-between items-center">

          <div className="font-semibold">
            {selectedCategory
              ? "Edit Category"
              : "New Category"}
          </div>

          {selectedCategory && (
            <button
              onClick={deleteCategory}
              className="text-red-500 text-sm"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">

          {error && (
            <div className="text-red-500 mb-3">
              {error}
            </div>
          )}

          {/* Name */}

          <div className="mb-4">
            <label className="font-medium">
              Category Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Enter category name"
            />
          </div>

          {/* Description */}

          <div className="mb-4">
            <label className="font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border rounded px-3 py-2 mt-1 h-40"
              placeholder="Enter category description"
            />
          </div>

          <button
            onClick={saveCategory}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {saving
              ? "Saving..."
              : selectedCategory
              ? "Update Category"
              : "Add Category"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminCategoryPanel;