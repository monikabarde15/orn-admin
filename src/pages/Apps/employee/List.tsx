import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconEye from '../../../components/Icon/IconEye';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import toast

const List = () => {
  const dispatch = useDispatch();

  // --- STATE ---
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<any>([]);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'employeeNumber',
    direction: 'asc',
  });

  // --- PAGE TITLE ---
  useEffect(() => {
    dispatch(setPageTitle('Employee List'));
  }, [dispatch]);

  // --- FETCH EMPLOYEES ---
  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://cybitbackend.onrender.com/api/employees');
      const data = res.data.data || [];

      const mapped = data.map((emp: any) => ({
        id: emp._id,
        employeeNumber: emp.employeeNumber,
        name: emp.name,
        mobileNumber: emp.mobileNumber || 'N/A',
        date: emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : 'N/A',
        amount: emp.salary || 0,
        currency: emp.currency || 'USD',
        status: { tooltip: 'Active', color: 'success' },
      }));

      setItems(mapped);
      setInitialRecords(sortBy(mapped, 'employeeNumber'));
      setRecords(sortBy(mapped, 'employeeNumber').slice(0, pageSize));
    } catch (err) {
      console.error('Error fetching employees:', err);
      toast.error('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- DELETE ROW(S) WITH TOAST ---
  const deleteRow = async (id: string | null = null) => {
    if (!window.confirm("Are you sure you want to delete selected row(s)?")) return;

    try {
      if (id) {
        await axios.delete(`https://cybitbackend.onrender.com/api/employees/${id}`);
        const updated = items.filter(item => item.id !== id);
        setItems(updated);
        setInitialRecords(updated);
        setRecords(updated);
        setSelectedRecords([]);
        setSearch('');
        toast.success('Employee deleted successfully');
      } else if (selectedRecords.length) {
        for (const row of selectedRecords) {
          await axios.delete(`https://cybitbackend.onrender.com/api/employees/${row.id}`);
        }
        const ids = selectedRecords.map((d: any) => d.id);
        const updated = items.filter(item => !ids.includes(item.id));
        setItems(updated);
        setInitialRecords(updated);
        setRecords(updated);
        setSelectedRecords([]);
        setSearch('');
        setPage(1);
        toast.success('Selected employees deleted successfully');
      }
    } catch (err) {
      console.error("Error deleting employee(s):", err);
      toast.error('Failed to delete employee(s)');
    }
  };

  const currencySymbols: Record<string, string> = {
    USD: "$",
    "USD - US Dollar": "$",
    "GBP - British Pound": "£",
    "IDR - Indonesian Rupiah": "Rp",
    INR: "₹",
    "BRL - Brazilian Real": "R$",
    EUR: "€",
    "TRY - Turkish Lira": "₺",
  };

  // --- PAGINATION ---
  useEffect(() => setPage(1), [pageSize]);
  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  // --- SEARCH FILTER ---
  useEffect(() => {
    setInitialRecords(
      items.filter(item =>
        item.employeeNumber?.toLowerCase().includes(search.toLowerCase()) ||
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.mobileNumber?.toLowerCase().includes(search.toLowerCase()) ||
        item.date?.toLowerCase().includes(search.toLowerCase()) ||
        item.amount?.toString().includes(search.toLowerCase()) ||
        item.status?.tooltip?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, items]);

  // --- SORT ---
  useEffect(() => {
    const sorted = sortBy(initialRecords, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === 'desc' ? sorted.reverse() : sorted);
    setPage(1);
  }, [sortStatus]);

  return (
    <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
      {/* ✅ Toast container */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="invoice-table">
        <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-danger gap-2" onClick={() => deleteRow()}>
              <IconTrashLines />
              Delete
            </button>
            <Link to="/apps/employee/add" className="btn btn-primary gap-2">
              <IconPlus />
              Add New
            </Link>
          </div>
          <div className="ltr:ml-auto rtl:mr-auto">
            <input
              type="text"
              className="form-input w-auto"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="datatables pagination-padding">
          <DataTable
            className="whitespace-nowrap table-hover invoice-table"
            records={records}
            columns={[
              {
                accessor: 'employeeNumber',
                sortable: true,
                title: 'Employee Number',
              },
              {
                accessor: 'name',
                sortable: true,
                title: 'Name',
              },
              {
                accessor: 'mobileNumber',
                sortable: true,
                title: 'Mobile Number',
              },
              {
                accessor: 'date',
                sortable: true,
                title: 'Joining Date',
              },
              {
                accessor: 'amount',
                sortable: true,
                title: 'Salary',
                titleClassName: 'text-right',
                render: ({ amount, currency }) => (
                  <div className="text-right font-semibold">
                    {currencySymbols[currency] || currency || "$"}{amount}
                  </div>
                ),
              },
              {
                accessor: 'status',
                sortable: true,
                title: 'Status',
                render: ({ status }) => (
                  <span className={`badge badge-outline-${status?.color || 'default'}`}>
                    {status?.tooltip || 'N/A'}
                  </span>
                ),
              },
              {
                accessor: 'action',
                title: 'Actions',
                sortable: false,
                textAlignment: 'center',
                render: ({ id }) => (
                  <div className="flex gap-4 items-center w-max mx-auto">
                    <NavLink to={`/apps/employee/edit/${id}`} className="flex hover:text-info">
                      <IconEdit className="w-4.5 h-4.5" />
                    </NavLink>
                    <NavLink to={`/apps/employee/Preview/${id}`} className="btn btn-primary w-full gap-2">
                      <IconEye className="w-4.5 h-4.5" />
                    </NavLink>
                    <button type="button" className="flex hover:text-danger" onClick={() => deleteRow(id)}>
                      <IconTrashLines />
                    </button>
                  </div>
                ),
              },
            ]}
            highlightOnHover
            totalRecords={initialRecords.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={setPage}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
          />
        </div>
      </div>
    </div>
  );
};

export default List;
