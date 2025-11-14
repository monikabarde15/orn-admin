import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setPageTitle } from "../../../store/themeConfigSlice";
import IconSave from "../../../components/Icon/IconSave";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import toast

const EditExpense = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [preview, setPreview] = useState("/assets/images/cybblackpink.png");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null as File | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(setPageTitle("Edit Expense"));
    if (id) fetchExpense(id);
  }, [dispatch, id]);

  const fetchExpense = async (expenseId: string) => {
    try {
      const res = await axios.get(
        `https://cybitbackend.onrender.com/api/expenses/${expenseId}`
      );
      const expense = res.data.data;

      setFormData({
        title: expense.title,
        description: expense.description,
        price: String(expense.price),
        image: null,
      });

      setPreview(expense.image || "/assets/images/cybblackpink.png");
    } catch (err) {
      console.error("Error fetching expense:", err);
      alert("Failed to load expense.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.title) titleRef.current?.focus();
      else if (newErrors.description) descriptionRef.current?.focus();
      else if (newErrors.price) priceRef.current?.focus();
      return false;
    }
    return true;
  };

  const updateExpense = async () => {
    if (!validateForm()) return;

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (formData.image) data.append("image", formData.image);

      const res = await axios.put(
        `https://cybitbackend.onrender.com/api/expenses/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        // alert("Expense updated successfully!");
                  setTimeout(() => {
                           toast.success('Expense updated successfully ');
                                    navigate('/apps/expenses/list'); // yahan apna route de jahan redirect karna hai
                          }, 1000);
      }
    } catch (err) {
      console.error("Error updating expense:", err);
      alert("Failed to update expense.");
    }
  };

  return (
    <div className="panel max-w-2xl mx-auto p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800">
      {/* Image Upload */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={preview}
          alt="Preview"
          className="w-28 h-28 object-cover rounded-xl border shadow-md mb-4"
        />
        <label className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          ref={titleRef}
          value={formData.title}
          onChange={handleChange}
          className={`form-input w-full ${
            errors.title ? "border-red-500" : ""
          }`}
          placeholder="Enter title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          ref={descriptionRef}
          value={formData.description}
          onChange={handleChange}
          className={`form-textarea w-full min-h-[100px] ${
            errors.description ? "border-red-500" : ""
          }`}
          placeholder="Write description..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        <label htmlFor="price" className="block font-medium mb-1">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          ref={priceRef}
          value={formData.price}
          onChange={handleChange}
          className={`form-input w-full ${
            errors.price ? "border-red-500" : ""
          }`}
          placeholder="Enter price"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          type="button"
          className="btn btn-success px-8 py-2 text-lg rounded-lg shadow-md"
          onClick={updateExpense}
        >
          <IconSave className="mr-2 shrink-0" /> Update
        </button>
      </div>
    </div>
  );
};

export default EditExpense;
