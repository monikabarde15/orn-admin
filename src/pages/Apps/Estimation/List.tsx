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
    columnAccessor: 'invoice',
    direction: 'asc',
  });

  // --- PAGE TITLE ---
  useEffect(() => {
    dispatch(setPageTitle('Invoice List'));
  }, [dispatch]);

  // --- FETCH INVOICES FROM API ---
  const currencySymbols: Record<string, string> = {
  "USD": "$",
  "USD - US Dollar": "$",
  "GBP - British Pound": "£",
  "IDR - Indonesian Rupiah": "Rp",
  "INR - Indian Rupee": "₹",
  "BRL - Brazilian Real": "R$",
  "EUR - Germany (Euro)": "€",
  "TRY - Turkish Lira": "₺",
};


  const fetchInvoices = async () => {
  try {
    const res = await axios.get('https://cybitbackend.onrender.com/api/estimation');
    const data = res.data.invoices || [];

    // Map API response to table-friendly format
    const mapped = data.map((inv: any) => {
      const totalAmount = inv.items.reduce((sum: number, item: any) => sum + item.amount, 0);
      return {
        id: inv._id,
        invoice: inv.invoiceNumber,
        name: inv.billing?.name || 'N/A',
        email: inv.billing?.email || 'N/A',
        date: inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : 'N/A',
        amount: totalAmount,
         currency: inv.currency || "USD", 
        status: { tooltip: 'Pending', color: 'danger' }, // or map real status if you have
      };
    });

    setItems(mapped);
    setInitialRecords(sortBy(mapped, 'invoice'));
    setRecords(sortBy(mapped, 'invoice').slice(0, pageSize));
  } catch (err) {
    console.error('Error fetching invoices:', err);
  }
};



  useEffect(() => {
    fetchInvoices();
  }, []);

  // --- DELETE ROW ---
  // --- DELETE ROW ---
const deleteRow = async (id: string | null = null) => {
  if (!window.confirm("Are you sure want to delete selected row?")) return;

  try {
    if (id) {
      // DELETE single invoice
      await axios.delete(`https://cybitbackend.onrender.com/api/estimation/${id}`);
      const updated = items.filter((item) => item.id !== id);
      setItems(updated);
      setInitialRecords(updated);
      setRecords(updated);
      setSelectedRecords([]);
      setSearch("");
       toast.success('Estimation deleted successfully!');
    } else if (selectedRecords.length) {
      // DELETE multiple selected invoices
      for (const row of selectedRecords) {
        await axios.delete(`https://cybitbackend.onrender.com/api/estimation/${row.id}`);
      }
      const ids = selectedRecords.map((d: any) => d.id);
      const updated = items.filter((item) => !ids.includes(item.id));
      setItems(updated);
      setInitialRecords(updated);
      setRecords(updated);
      setSelectedRecords([]);
      setSearch("");
       toast.success('Estimation deleted successfully!');
      setPage(1);
    }
  } catch (err) {
    console.error("Error deleting invoice(s):", err);
    alert("Failed to delete invoice(s).");
  }
};


  // --- PAGINATION ---
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  // --- SEARCH FILTER ---
  useEffect(() => {
    setInitialRecords(
      items.filter((item) => {
        return (
          item.invoice?.toLowerCase().includes(search.toLowerCase()) ||
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase()) ||
          item.date?.toLowerCase().includes(search.toLowerCase()) ||
          item.amount?.toString().includes(search.toLowerCase()) ||
          item.status?.tooltip?.toLowerCase().includes(search.toLowerCase())
        );
      })
    );
  }, [search, items]);

  // --- SORT ---
  useEffect(() => {
    const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
    setPage(1);
  }, [sortStatus]);

  return (
    <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
       <Toaster position="top-right" reverseOrder={false} />
      <div className="invoice-table">
        <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-danger gap-2" onClick={() => deleteRow()}>
              <IconTrashLines />
              Delete
            </button>
            <Link to="/apps/estimation/add" className="btn btn-primary gap-2">
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
                accessor: 'invoice',
                sortable: true,
                render: ({ invoice }) => (
                  <NavLink to="/apps/estimation/preview">
                    <div className="text-primary underline hover:no-underline font-semibold">{`#${invoice}`}</div>
                  </NavLink>
                ),
              },
              {
                accessor: 'name',
                sortable: true,
                render: ({ name, id }) => (
                  <div className="flex items-center font-semibold">
                    {/* <div className="p-0.5 bg-white-dark/30 rounded-full w-max ltr:mr-2 rtl:ml-2">
                      <img className="h-8 w-8 rounded-full object-cover" src={`/assets/images/profile-${id}.jpeg`} alt="" />
                    </div> */}
                    <div>{name}</div>
                  </div>
                ),
              },
              { accessor: 'email', sortable: true },
              { accessor: 'date', sortable: true },
              {
  accessor: 'amount',
  sortable: true,
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
                    <NavLink to={`/apps/estimation/edit/${id}`} className="flex hover:text-info">
                      <IconEdit className="w-4.5 h-4.5" />
                    </NavLink>
                    {/* <NavLink to={`/apps/estimation/preview/${id}`} className="btn btn-primary w-full gap-2">
                     <IconEye className="w-4.5 h-4.5" />
                    </NavLink> */}
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
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
          />
        </div>
      </div>
    </div>
  );
};

export default List;
