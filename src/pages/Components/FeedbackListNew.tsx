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
import axios from "axios";

const API_URL = "https://backend.onrequestlab.com/api/v1/admin/feedback/";

const FeedbackListNew = () => {
  const dispatch = useDispatch();
  const [addContactModal, setAddContactModal] = useState(false);
  const [value, setValue] = useState("list");

  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch access token from cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  const accessToken = getCookie("access");

  // ✅ Fetch all contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        withCredentials: true,
      });

      const data = Array.isArray(res.data.results) ? res.data.results : [];
      setContactList(data);
      setFilteredItems(data);
    } catch (err) {
      console.error("Error fetching Feedback:", err);
      showMessage("Failed to fetch Feedback", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete contact
  const deleteUser = async (user) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This contact will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}${user.feedback_id}/`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        withCredentials: true,
      });

      setContactList(contactList.filter((c) => c.feedback_id !== user.feedback_id));
      showMessage("Feedback deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      showMessage("Failed to delete contact", "error");
    }
  };

  // ✅ Show toast
  const showMessage = (msg, type = "success") => {
    Swal.fire({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 2500,
      icon: type,
      title: msg,
    });
  };

  // ✅ Search contacts
  useEffect(() => {
    setFilteredItems(
      contactList.filter((c) =>
        `${c.first_name} ${c.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search, contactList]);

  useEffect(() => {
    dispatch(setPageTitle("Contacts"));
    fetchContacts();
  }, [dispatch]);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Feedback List</h2>
        <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
          <div className="flex gap-3">
            <button
              type="button"
              className={`btn btn-outline-primary p-2 ${
                value === "list" && "bg-primary text-white"
              }`}
              onClick={() => setValue("list")}
            >
              <IconListCheck />
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary p-2 ${
                value === "grid" && "bg-primary text-white"
              }`}
              onClick={() => setValue("grid")}
            >
              <IconLayoutGrid />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search Feedback"
              className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary"
            >
              <IconSearch className="mx-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {value === "list" && (
        <div className="mt-5 panel p-0 border-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>subject</th>
                  <th>description</th>
                  <th>Date</th>
                  <th className="!text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      Loading...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No feedback found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.feedback_id}>
                      <td>{item.feedback_id}</td>
                      <td>
                        {item.user}
                      </td>
                      <td>{item.subject}</td>
                      <td>{item.description}</td>
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

      {/* Grid View */}
      {value === "grid" && (
        <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5">
          {filteredItems.map((item) => (
            <div
              key={item.feedback_id}
              className="bg-white dark:bg-[#1c232f] rounded-md p-5 shadow text-center relative"
            >
              <h4 className="text-lg font-semibold mb-2">
                {item.first_name} {item.last_name}
              </h4>
              <p className="text-sm text-gray-500 mb-1">{item.email}</p>
              <p className="text-sm text-gray-500 mb-1">{item.phone}</p>
              <p className="text-sm text-gray-600 italic mb-4 truncate">
                {item.message}
              </p>
              <div className="flex justify-center space-x-3 mb-4">
                <IconFacebook />
                <IconInstagram />
                <IconLinkedin />
                <IconTwitter />
              </div>
              <button
                type="button"
                className="btn btn-outline-danger w-full"
                onClick={() => deleteUser(item)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal (future add/edit) */}
      <Transition appear show={addContactModal} as={Fragment}>
        <Dialog
          as="div"
          open={addContactModal}
          onClose={() => setAddContactModal(false)}
          className="relative z-[51]"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[black]/60" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                  <button
                    type="button"
                    onClick={() => setAddContactModal(false)}
                    className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                  >
                    <IconX />
                  </button>
                  <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] py-3 px-5">
                    Add Contact
                  </div>
                  {/* Add form here if needed */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default FeedbackListNew;
