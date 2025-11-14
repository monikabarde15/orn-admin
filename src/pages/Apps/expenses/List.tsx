import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import IconPlus from "../../../components/Icon/IconPlus";
import IconEdit from "../../../components/Icon/IconEdit";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import toast

const List = () => {
  const dispatch = useDispatch();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");

  const pageSize = 5; // per page records

  useEffect(() => {
    dispatch(setPageTitle("Expense List"));
    fetchExpenses();
  }, [dispatch]);

  // --- FETCH EXPENSES ---
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("https://cybitbackend.onrender.com/api/expenses");
      setExpenses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  // --- DELETE EXPENSE ---
  const deleteExpense = async (id: string) => {
    if (!window.confirm("Are you sure want to delete this expense?")) return;

    try {
      await axios.delete(`https://cybitbackend.onrender.com/api/expenses/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
      toast.success("Expense deleted successfully ✅");

      setTimeout(() => setSuccessMsg(""), 3000); // 3 sec बाद msg हटेगा
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Failed to delete expense.");
    }
  };

  // --- FILTER & PAGINATION ---
  const filteredExpenses = expenses.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExpenses.length / pageSize);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // --- IMAGE HANDLER ---
  const getImageUrl = (img: string) => {
    if (!img) return "/assets/images/cybblackpink.png"; // fallback
    if (img.startsWith("http")) return img; // अगर full url है तो
    return `https://cybitbackend.onrender.com/uploads/${img}`; // अगर सिर्फ filename है तो backend upload path से जोड़कर
  };

  return (
    <div className="panel p-4">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          Expense List ({expenses.length} total)
        </h2>
        <Link to="/apps/expenses/add" className="btn btn-primary gap-2">
          <IconPlus /> Add Expense
        </Link>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">
          {successMsg}
        </div>
      )}

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // search change पर first page दिखे
          }}
          className="form-input w-full md:w-1/3"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExpenses.length ? (
              paginatedExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    <img
                      src={getImageUrl(expense.image)}
                      alt={expense.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-2 border">{expense.title}</td>
                  <td className="p-2 border">{expense.description}</td>
                  <td className="p-2 border">₹ {expense.price}</td>
                  <td className="p-2 border text-center">
                    <div className="flex gap-3 justify-center">
                      <NavLink
                        to={`/apps/expenses/edit/${expense._id}`}
                        className="flex hover:text-info"
                      >
                        <IconEdit className="w-5 h-5" />
                      </NavLink>
                      <button
                        type="button"
                        className="flex hover:text-danger"
                        onClick={() => deleteExpense(expense._id)}
                      >
                        <IconTrashLines className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
