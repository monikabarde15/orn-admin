import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://backend.onrequestlab.com/api/v1/admin/blog/";
const IMAGE_BASE = "https://backend.onrequestlab.com";

const AdminBlogPanel = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };
  const accessToken = getCookie("access");

  // ✅ Helper: Full Image Path
  const getFullImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${IMAGE_BASE}${path}`;
  };

  /* ----------------------------- Load Blogs ----------------------------- */
  const loadBlogs = async () => {
    setLoadingBlogs(true);
    setError("");
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setBlogs(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error loading blogs:", err);
      if (err.response?.status === 403) {
        setError("You do not have permission to view blogs. Admin access required.");
      } else {
        setError("Failed to load blogs.");
      }
    } finally {
      setLoadingBlogs(false);
    }
  };

  /* ----------------------------- Select Blog ----------------------------- */
  const openBlog = (blog) => {
    setSelectedBlog(blog);
    setTitle(blog.title || "");
    setDescription(blog.description || "");
    // ✅ priority: imageUrl > image
    if (blog.imageUrl) setImageUrl(blog.imageUrl);
    else setImageUrl(blog.image || "");
    setImageFile(null);
    setError("");
  };

  /* ----------------------------- Save Blog ----------------------------- */
  const saveBlog = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (imageFile) formData.append("image", imageFile);
      if (imageUrl) formData.append("imageUrl", imageUrl);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      if (selectedBlog) {
        await axios.put(`${API_BASE}${selectedBlog.blogId}/`, formData, config);
      } else {
        await axios.post(API_BASE, formData, config);
      }

      setTitle("");
      setDescription("");
      setImageUrl("");
      setImageFile(null);
      setSelectedBlog(null);
      loadBlogs();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("You do not have permission to save blogs. Admin access required.");
      } else {
        setError("Failed to save blog.");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ----------------------------- Delete Blog ----------------------------- */
  const deleteBlog = async () => {
    if (!selectedBlog) return;
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    setDeleting(true);
    setError("");
    try {
      await axios.delete(`${API_BASE}${selectedBlog.blogId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSelectedBlog(null);
      setTitle("");
      setDescription("");
      setImageUrl("");
      setImageFile(null);
      loadBlogs();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("You do not have permission to delete blogs. Admin access required.");
      } else {
        setError("Failed to delete blog.");
      }
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  /* ----------------------------- JSX ----------------------------- */
  return (
    <div className="flex flex-col md:flex-row h-[85vh] bg-gray-100 rounded-lg shadow-md overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 font-semibold text-lg border-b bg-blue-50 text-blue-700">
          📝 Blog Management
        </div>

        {loadingBlogs ? (
          <div className="p-4 text-center text-gray-500">Loading blogs...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500 font-medium">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No blogs found</div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {blogs.map((blog) => {
              // ✅ Show imageUrl if present else image
              const imgSrc =getFullImageUrl(blog.image)
                ? getFullImageUrl(blog.image) 
                : getFullImageUrl(blog.imageUrl);

              return (
                <div
                  key={blog.blogId}
                  className={`p-3 cursor-pointer border-b hover:bg-blue-50 transition flex items-center gap-3 ${
                    selectedBlog?.blogId === blog.blogId ? "bg-blue-100" : ""
                  }`}
                  onClick={() => openBlog(blog)}
                >
                  <div className="w-14 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-100 border">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{blog.title}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {blog.description?.replace(/<[^>]*>?/gm, "").substring(0, 50)}...
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => {
            setSelectedBlog(null);
            setTitle("");
            setDescription("");
            setImageUrl("");
            setImageFile(null);
          }}
          className="m-4 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg"
        >
          + Add New Blog
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <div className="font-semibold text-gray-800">
            {selectedBlog ? "Edit Blog" : "New Blog"}
          </div>
          {selectedBlog && (
            <button
              onClick={deleteBlog}
              disabled={deleting}
              className="text-sm text-red-500 hover:underline"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && <div className="mb-4 text-red-500 font-medium">{error}</div>}

          {/* Title */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Image File */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="mt-2 w-32 h-20 object-cover rounded"
              />
            )}
          </div>

          {/* Image URL */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Or Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {!imageFile && imageUrl && (
              <img
                src={getFullImageUrl(imageUrl)}
                alt="Blog"
                className="mt-2 w-32 h-20 object-cover rounded"
              />
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={saveBlog}
            disabled={saving || !title.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {saving ? "Saving..." : selectedBlog ? "Update Blog" : "Add Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogPanel;
