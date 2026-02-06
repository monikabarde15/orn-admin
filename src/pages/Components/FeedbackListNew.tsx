import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";

import IconListCheck from "../../components/Icon/IconListCheck";
import IconLayoutGrid from "../../components/Icon/IconLayoutGrid";
import IconSearch from "../../components/Icon/IconSearch";
import IconX from "../../components/Icon/IconX";

import api from "../../services/api";

const API_URL = "/api/v1/admin/feedback/";
const PAGE_SIZE = 10;

const FeedbackListNew = () => {
  const dispatch = useDispatch();

  const [view, setView] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");

  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  /* ================= TOAST ================= */

  const showMessage = (
    msg: string,
    type: "success" | "error" = "success"
  ) => {
    Swal.fire({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 2500,
      icon: type,
      title: msg,
    });
  };

  /* ================= FETCH FEEDBACK ================= */

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.get(API_URL, {
        params: {
          page,
          page_size: PAGE_SIZE,
          search: search || undefined, // optional server-side search
        },
      });

      setFeedbackList(res.data?.results || []);
      setTotalCount(res.data?.count || 0);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      showMessage("Failed to fetch feedback", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE FEEDBACK ================= */

  const deleteFeedback = async (item: any) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This feedback will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`${API_URL}${item.feedback_id}/`);
      showMessage("Feedback deleted");

      // 🔥 refetch same page
      fetchFeedback();
    } catch (error) {
      console.error("Delete failed:", error);
      showMessage("Failed to delete feedback", "error");
    }
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    dispatch(setPageTitle("Feedback"));
  }, [dispatch]);

  useEffect(() => {
    fetchFeedback();
  }, [page, search]);

  /* ================= PAGINATION UI ================= */

  const Pagination = () => {
  if (totalPages <= 1) return null;

  const MAX_PAGES = 5;
  let start = Math.max(1, page - Math.floor(MAX_PAGES / 2));
  let end = start + MAX_PAGES - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - MAX_PAGES + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-between items-center mt-6">
      {/* INFO */}
      <p className="text-sm text-gray-500">
        Page <b>{page}</b> of <b>{totalPages}</b> • Total {totalCount}
      </p>

      {/* CONTROLS */}
      <div className="flex items-center gap-1">
        {/* PREV */}
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {/* PAGE NUMBERS */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`btn btn-sm ${
              p === page
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
          >
            {p}
          </button>
        ))}

        {/* NEXT */}
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};


  /* ================= UI ================= */

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Feedback List</h2>

        <div className="flex gap-3">
          <button
            className={`btn btn-outline-primary p-2 ${
              view === "list" ? "bg-primary text-white" : ""
            }`}
            onClick={() => setView("list")}
          >
            <IconListCheck />
          </button>

          <button
            className={`btn btn-outline-primary p-2 ${
              view === "grid" ? "bg-primary text-white" : ""
            }`}
            onClick={() => setView("grid")}
          >
            <IconLayoutGrid />
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Search feedback"
              className="form-input py-2 pr-10"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
            <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* ================= LIST VIEW ================= */}
      {view === "list" && (
        <div className="mt-5 panel p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : feedbackList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No feedback found
                    </td>
                  </tr>
                ) : (
                  feedbackList.map((item) => (
                    <tr key={item.feedback_id}>
                      <td>{item.feedback_id}</td>
                      <td>{item.user}</td>
                      <td>{item.subject}</td>
                      <td className="max-w-[300px] truncate">
                        {item.description}
                      </td>
                      <td>
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteFeedback(item)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination />
        </div>
      )}

      {/* ================= GRID VIEW ================= */}
      {view === "grid" && (
        <>
          <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5">
            {feedbackList.map((item) => (
              <div
                key={item.feedback_id}
                className="bg-white rounded-md p-5 shadow"
              >
                <h4 className="font-semibold">{item.subject}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {item.user}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {item.description}
                </p>

                <button
                  className="btn btn-outline-danger btn-sm w-full mt-4"
                  onClick={() => deleteFeedback(item)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <Pagination />
        </>
      )}
    </div>
  );
};

export default FeedbackListNew;
