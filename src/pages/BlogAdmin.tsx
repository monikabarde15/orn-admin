import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../services/api";

const API_BASE = "/api/v1/admin/blog/";
const IMAGE_BASE = import.meta.env.VITE_API_URL;

/* ================= Quill Config ================= */
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
];

const AdminBlogPanel = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  /* ================= Helpers ================= */
  const getFullImageUrl = (path?: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${IMAGE_BASE}${path}`;
  };

  const resetForm = () => {
    setSelectedBlog(null);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setImageFile(null);
    setError("");
  };

  /* ================= Load Blogs ================= */
  const loadBlogs = async () => {
  setLoadingBlogs(true);
  try {
    const res = await api.get(API_BASE);

    const list = (res.data.results || res.data || []).map((b: any) => ({
      ...b,
      id: b.id || b.blogId, // ✅ NORMALIZE HERE
    }));

    setBlogs(list);
  } catch (err) {
    setError("Failed to load blogs");
  } finally {
    setLoadingBlogs(false);
  }
};


  useEffect(() => {
    loadBlogs();
  }, []);

  /* ================= Select Blog ================= */

  const openBlog = (blog: any) => {
  setSelectedBlog(blog);

  setTitle(blog.title || "");
  setDescription(blog.description || "");
  setImageUrl(blog.image || blog.imageUrl || "");
  setImageFile(null);
};


  /* ================= Save Blog ================= */
  const saveBlog = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (imageFile) formData.append("image", imageFile);
      else if (imageUrl) formData.append("imageUrl", imageUrl);

      if (selectedBlog) {
       await api.put(
  `/api/v1/admin/blog/${selectedBlog.id}/`,
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);

      } else {
        await api.post(API_BASE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      loadBlogs();
    } catch (err) {
      setError("Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  /* ================= Delete Blog ================= */
  const deleteBlog = async () => {
    if (!selectedBlog) return;
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    setDeleting(true);
    try {
      await api.delete(`${API_BASE}${selectedBlog.id}/`);
      resetForm();
      loadBlogs();
    } catch (err) {
      setError("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= JSX ================= */
  return (
    <div className="flex flex-col md:flex-row h-[85vh] bg-gray-100 rounded-lg shadow overflow-hidden">
      {/* ================= Sidebar ================= */}
      <div className="w-full md:w-1/3 bg-white border-r flex flex-col">
        <div className="p-4 font-semibold text-lg bg-blue-50 text-blue-700">
          📝 Blog Management
        </div>

        {loadingBlogs ? (
          <div className="p-4 text-center">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No blogs found</div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => openBlog(blog)}
                className={`p-3 cursor-pointer border-b flex gap-3 ${
                  selectedBlog?.id === blog.id
                    ? "bg-blue-100"
                    : "hover:bg-blue-50"
                }`}
              >

                <div className="w-14 h-14 bg-gray-100 border rounded overflow-hidden">
                  {blog.image || blog.imageUrl ? (
                    <img
                      src={getFullImageUrl(blog.image || blog.imageUrl)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-xs text-gray-400 flex items-center justify-center h-full">
                      No Image
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-medium">{blog.title}</div>
                  <div className="text-xs text-gray-500">
                    {blog.description
                      ?.replace(/<[^>]*>?/gm, "")
                      .slice(0, 60)}
                    …
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={resetForm}
          className="m-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          + Add New Blog
        </button>
      </div>

      {/* ================= Editor ================= */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="p-4 bg-white border-b flex justify-between items-center">
          <div className="font-semibold">
            {selectedBlog ? "Edit Blog" : "New Blog"}
          </div>
          {selectedBlog && (
            <button
              onClick={deleteBlog}
              className="text-red-500 text-sm"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && <div className="text-red-500 mb-3">{error}</div>}

          {/* Title */}
          <div className="mb-4">
            <label className="font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="font-medium">Description</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={quillModules}
              formats={quillFormats}
              className="bg-white mt-1"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="font-medium">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files ? e.target.files[0] : null)
              }
              className="w-full border rounded px-3 py-2 mt-1"
            />

            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                className="mt-2 w-32 h-20 object-cover rounded"
              />
            )}
          </div>

          {/* Image URL */}
          <div className="mb-4">
            <label className="font-medium">Or Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />

            {!imageFile && imageUrl && (
              <img
                src={getFullImageUrl(imageUrl)}
                className="mt-2 w-32 h-20 object-cover rounded"
              />
            )}
          </div>

          <button
            onClick={saveBlog}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {saving
              ? "Saving..."
              : selectedBlog
              ? "Update Blog"
              : "Add Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogPanel;
