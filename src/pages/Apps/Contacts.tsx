import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";

import IconListCheck from "../../components/Icon/IconListCheck";
import IconLayoutGrid from "../../components/Icon/IconLayoutGrid";
import IconSearch from "../../components/Icon/IconSearch";
import IconFacebook from "../../components/Icon/IconFacebook";
import IconInstagram from "../../components/Icon/IconInstagram";
import IconLinkedin from "../../components/Icon/IconLinkedin";
import IconTwitter from "../../components/Icon/IconTwitter";
import IconX from "../../components/Icon/IconX";

import api from "../../services/api"; // ✅ token based axios instance

// ✅ CORRECT API URL (string only)
const API_URL = "/api/v1/admin/contact/";

const Contacts = () => {
  const dispatch = useDispatch();

  const [view, setView] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [addContactModal, setAddContactModal] = useState(false);

  /* ================= TOAST ================= */

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    Swal.fire({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 2500,
      icon: type,
      title: msg,
    });
  };

  /* ================= FETCH CONTACTS ================= */

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get(API_URL);

      const data = Array.isArray(res.data?.results)
        ? res.data.results
        : [];

      setContactList(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Fetch contacts failed:", error);
      showMessage("Failed to fetch contacts", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE CONTACT ================= */

  const deleteUser = async (user: any) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This contact will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`${API_URL}${user.contact_id}/`);

      setContactList((prev) =>
        prev.filter((c) => c.contact_id !== user.contact_id)
      );

      showMessage("Contact deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      showMessage("Failed to delete contact", "error");
    }
  };

  /* ================= SEARCH ================= */

  useEffect(() => {
    setFilteredItems(
      contactList.filter((c) =>
        `${c.first_name} ${c.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search, contactList]);

  /* ================= INIT ================= */

  useEffect(() => {
    dispatch(setPageTitle("Contacts"));
    fetchContacts();
  }, [dispatch]);

  /* ================= UI ================= */

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Contacts</h2>

        <div className="flex sm:flex-row flex-col gap-4">
          <div className="flex gap-2">
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
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search Contacts"
              className="form-input py-2 pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.contact_id}>
                      <td>{item.contact_id}</td>
                      <td>{item.first_name} {item.last_name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td className="max-w-[250px] truncate">{item.message}</td>
                      <td>{new Date(item.timestamp).toLocaleString()}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteUser(item)}
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
        </div>
      )}

      {/* ================= GRID VIEW ================= */}
      {view === "grid" && (
        <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5">
          {filteredItems.map((item) => (
            <div
              key={item.contact_id}
              className="bg-white dark:bg-[#1c232f] rounded-md p-5 shadow text-center"
            >
              <h4 className="text-lg font-semibold mb-1">
                {item.first_name} {item.last_name}
              </h4>
              <p className="text-sm text-gray-500">{item.email}</p>
              <p className="text-sm text-gray-500">{item.phone}</p>

              <p className="text-sm text-gray-600 italic my-3 truncate">
                {item.message}
              </p>

              <div className="flex justify-center gap-3 mb-4">
                <IconFacebook />
                <IconInstagram />
                <IconLinkedin />
                <IconTwitter />
              </div>

              <button
                className="btn btn-outline-danger w-full"
                onClick={() => deleteUser(item)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;
