import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconX from '../../../components/Icon/IconX';
import IconSend from '../../../components/Icon/IconSend';
import IconSave from '../../../components/Icon/IconSave';
import IconEye from '../../../components/Icon/IconEye';
import IconDownload from '../../../components/Icon/IconDownload';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import toast
import { useNavigate } from 'react-router-dom';


// ✅ Interfaces
interface BillingInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface BankInfo {
  accountNumber: string;
  bankName: string;
  swiftNumber: string;
  country: string;
  ibanNumber: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  quantity: number;
  amount: number;
}

interface InvoiceParams {
  invoiceLabel: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  notes: string;
  to: BillingInfo;
  bankInfo: BankInfo;
}

const Edit = () => {
            const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const currencyList = [
    'USD - US Dollar',
    'GBP - British Pound',
    'IDR - Indonesian Rupiah',
    'INR - Indian Rupee',
    'BRL - Brazilian Real',
    'EUR - Germany (Euro)',
    'TRY - Turkish Lira',
  ];

  const currencySymbols: Record<string, string> = {
    'USD - US Dollar': '$',
    'GBP - British Pound': '£',
    'IDR - Indonesian Rupiah': 'Rp',
    'INR - Indian Rupee': '₹',
    'BRL - Brazilian Real': 'R$',
    'EUR - Germany (Euro)': '€',
    'TRY - Turkish Lira': '₺',
  };

  const [params, setParams] = useState<InvoiceParams>({
    invoiceLabel: '',
    invoiceNo: '',
    invoiceDate: '',
    dueDate: '',
    notes: '',
    to: {
      name: '',
      email: '',
      address: '',
      phone: '',
    },
    bankInfo: {
      accountNumber: '',
      bankName: '',
      swiftNumber: '',
      country: '',
      ibanNumber: '',
    },
  });

  const [items, setItems] = useState<Item[]>([]);
  const [tax, setTax] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD - US Dollar');
  const [paymentMethod, setPaymentMethod] = useState<string>('bank');

  // ✅ Fetch invoice data
  useEffect(() => {
    if (!id) return;

    axios
      .get(`https://cybitbackend.onrender.com/api/estimation/${id}`)
      .then((res) => {
        if (res.data.success && res.data.invoice) {
          const inv = res.data.invoice;
          setParams({
            invoiceLabel: inv.invoiceLabel || '',
            invoiceNo: inv.invoiceNumber || '',
            invoiceDate: inv.invoiceDate ? inv.invoiceDate.split('T')[0] : '',
            dueDate: inv.dueDate ? inv.dueDate.split('T')[0] : '',
            notes: inv.notes || '',
            to: {
              name: inv.billing?.name || '',
              email: inv.billing?.email || '',
              address: inv.billing?.address || '',
              phone: inv.billing?.phone || '',
            },
            bankInfo: {
              accountNumber: inv.paymentDetails?.accountNumber || '',
              bankName: inv.paymentDetails?.bankName || '',
              swiftNumber: inv.paymentDetails?.swiftNumber || '',
              country: inv.paymentDetails?.country || '',
              ibanNumber: inv.paymentDetails?.ibanNumber || '',
            },
          });
          setItems(
            inv.items?.map((item: any) => ({
              ...item,
              id: crypto.randomUUID(),
            })) || []
          );
          setTax(inv.tax || 0);
          setDiscount(inv.discount || 0);
          setShippingCharge(inv.shippingCharge || 0);
          setSelectedCurrency(inv.currency || 'USD - US Dollar');
        }
      })
      .catch((err) => console.error('Failed to fetch invoice', err));
  }, [id]);

  // ✅ Update item
  const updateItem = (itemId: string, field: keyof Item, value: string | number) => {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item))
    );
  };

  // ✅ Add item
  const addItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), title: '', description: '', quantity: 0, amount: 0 },
    ]);
  };

  // ✅ Remove item
  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const validateForm = (): boolean => {
  if (!params.invoiceNo.trim()) {
    const el = document.getElementById('number');
    el?.focus();
    return false;
  }
  if (!params.invoiceLabel.trim()) {
    const el = document.getElementById('invoiceLabel');
    el?.focus();
    return false;
  }
  if (!params.invoiceDate.trim()) {
    const el = document.getElementById('startDate');
    el?.focus();
    return false;
  }
  if (!params.dueDate.trim()) {
    const el = document.getElementById('dueDate');
    el?.focus();
    return false;
  }
  if (!params.to.name.trim()) {
    const el = document.getElementById('reciever-name');
    el?.focus();
    return false;
  }
  if (!params.to.email.trim()) {
    const el = document.getElementById('reciever-email');
    el?.focus();
    return false;
  }
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(params.to.email)) {
    const el = document.getElementById('reciever-email');
    el?.focus();
    return false;
  }
  if (!params.to.address.trim()) {
    const el = document.getElementById('reciever-address');
    el?.focus();
    return false;
  }
  if (!params.bankInfo.accountNumber.trim()) {
    const el = document.getElementById('acno');
    el?.focus();
    return false;
  }
  if (!params.bankInfo.bankName.trim()) {
    const el = document.getElementById('bank-name');
    el?.focus();
    return false;
  }
  if (!paymentMethod) {
    const el = document.getElementById('payment-method');
    el?.focus();
    return false;
  }
  if (!params.notes.trim()) {
    const el = document.getElementById('notes');
    el?.focus();
    return false;
  }

  // Items validation
  if (items.length === 0) {
    const el = document.getElementById('add-item-button'); // add item button ko focus
    el?.focus();
    return false;
  }
  // Payment Details validation
if (paymentMethod === 'bank') {
  if (!params.bankInfo.accountNumber.trim()) {
    const el = document.getElementById('acno');
    el?.focus();
    return false;
  }
  if (!params.bankInfo.bankName.trim()) {
    const el = document.getElementById('bank-name');
    el?.focus();
    return false;
  }
  if (!params.bankInfo.swiftNumber.trim()) {
    const el = document.getElementById('swift-no');
    el?.focus();
    return false;
  }
  if (!params.bankInfo.ibanNumber.trim()) {
    const el = document.getElementById('iban-no');
    el?.focus();
    return false;
  }
  if (!params.bankInfo.country.trim()) {
    const el = document.querySelector('select') as HTMLElement;
    el?.focus();
    return false;
  }
}

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemTitleEl = document.getElementById(`item-title-${item.id}`);
    const itemQtyEl = document.getElementById(`item-qty-${item.id}`);
    const itemPriceEl = document.getElementById(`item-price-${item.id}`);

    if (!item.title.trim()) {
      itemTitleEl?.focus();
      return false;
    }
    if (item.quantity <= 0) {
      itemQtyEl?.focus();
      return false;
    }
    if (item.amount <= 0) {
      itemPriceEl?.focus();
      return false;
    }
  }

  return true;
};


  // ✅ Save invoice
  const handleSave = () => {
      if (!validateForm()) return;

    if (!id) return;

    const payload = {
      invoiceLabel: params.invoiceLabel,
      invoiceNumber: params.invoiceNo,
      invoiceDate: params.invoiceDate,
      dueDate: params.dueDate,
      notes: params.notes,
      billing: params.to,
      paymentDetails: params.bankInfo,
      items,
      tax,
      discount,
      shippingCharge,
      currency: selectedCurrency,
      paymentMethod,
    };

    axios
      .put(`https://cybitbackend.onrender.com/api/estimation/${id}`, payload)
      .then((res) => {
        if (res.data.success)              setTimeout(() => {
                   toast.success('Invoice updated successfully');
                            navigate('/apps/estimation/list'); // yahan apna route de jahan redirect karna hai
                  }, 1000);
                  // alert('Invoice updated successfully!');
        else alert('Failed to update invoice!');
      })
      .catch((err) => {
        console.error('Update failed', err);
        alert('Error updating invoice. Check console.');
      });
  };

  // ✅ Totals
  const subtotal = items.reduce(
    (acc: number, item: Item) => acc + item.amount * item.quantity,
    0
  );
  const total =
    subtotal +
    (subtotal * tax) / 100 +
    shippingCharge -
    (subtotal * discount) / 100;

  return (
    <div className="flex xl:flex-row flex-col gap-2.5">
      {/* Main panel */}
      <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
        {/* Invoice Header */}
        <div className="flex justify-between flex-wrap px-4">
          <div className="mb-6 lg:w-1/2 w-full">
            <img src="/assets/images/cybblackpink.png" alt="logo" className="w-14" />
            <div className="space-y-1 mt-6 text-gray-500 dark:text-gray-400">
              <div>G-9/85,Sangam Vihar New Delhi-110080</div>
              <div>info@cybite.in</div>
              <div>+91 8210543772</div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full lg:max-w-fit">
          
            {['Invoice Number', 'Invoice Label', 'Invoice Date', 'Due Date'].map(
              (label) => {
                const field = label.replace(/\s/g, '').toLowerCase();
                const type = label.includes('Date') ? 'date' : 'text';
                const value =
                  field === 'invoicenumber'
                    ? params.invoiceNo
                    : field === 'invoicelabel'
                    ? params.invoiceLabel
                    : field === 'invoicedate'
                    ? params.invoiceDate
                    : params.dueDate;
                return (
                  <div className="flex items-center mt-4" key={label}>
                    <label className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">{label}</label>
                    <input
                      id={field === 'invoicenumber' ? 'number' : field === 'invoicelabel' ? 'invoiceLabel' : field === 'invoicedate' ? 'startDate' : 'dueDate'}

                      type={type}
                      className="form-input lg:w-[250px] w-2/3"
                      value={value}
                      onChange={(e) => {
                        if (field === 'invoicenumber')
                          setParams({ ...params, invoiceNo: e.target.value });
                        else if (field === 'invoicelabel')
                          setParams({ ...params, invoiceLabel: e.target.value });
                        else if (field === 'invoicedate')
                          setParams({ ...params, invoiceDate: e.target.value });
                        else setParams({ ...params, dueDate: e.target.value });
                      }}
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Bill To & Payment Details */}
        <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
        <div className="mt-8 px-4 flex flex-col lg:flex-row gap-6">
          {/* Bill To */}
          <div className="lg:w-1/2 w-full space-y-4">
            <div className="text-lg">Bill To :-</div>
            {(['name', 'email', 'address', 'phone'] as (keyof BillingInfo)[]).map(
              (field) => (
                <div className="flex items-center" key={field}>
                  <label className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={`reciever-${field}`} // id: reciever-name, reciever-email, etc.

                    type={field === 'email' ? 'email' : 'text'}
                    className="form-input flex-1"
                    placeholder={`Enter ${field}`}
                    value={params.to[field]}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        to: { ...params.to, [field]: e.target.value },
                      })
                    }
                  />
                </div>
              )
            )}
          </div>

          {/* Payment Details */}
          <div className="lg:w-1/2 w-full space-y-4">
            <div className="text-lg">Payment Details:</div>
            {[
              { label: 'Account Number', field: 'accountNumber' },
              { label: 'Bank Name', field: 'bankName' },
              { label: 'SWIFT Number', field: 'swiftNumber' },
              { label: 'IBAN Number', field: 'ibanNumber' },
            ].map((input) => (
              <div className="flex items-center" key={input.field}>
                <label className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">{input.label}</label>
                <input
                  id={input.field === 'accountNumber' ? 'acno' : input.field === 'bankName' ? 'bank-name' : input.field === 'swiftNumber' ? 'swift-no' : 'iban-no'}

                  type="text"
                  className="form-input flex-1"
                  value={params.bankInfo[input.field as keyof BankInfo]}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      bankInfo: {
                        ...params.bankInfo,
                        [input.field]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
            <div className="flex items-center">
              <label className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Country</label>
              <select
              id="country"
                className="form-select flex-1"
                value={params.bankInfo.country}
                onChange={(e) =>
                  setParams({
                    ...params,
                    bankInfo: { ...params.bankInfo, country: e.target.value },
                  })
                }
              >
                <option value="">Choose Country</option>
                {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'India'].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8 px-4">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="w-1">Quantity</th>
                  <th className="w-1">Price</th>
                  <th>Total</th>
                  <th className="w-1"></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center font-semibold">
                      No Item Available
                    </td>
                  </tr>
                )}
                {items.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td>
                      <input
                        id={`item-title-${item.id}`}

                        type="text"
                        className="form-input min-w-[200px]"
                        placeholder="Enter Item Name"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                      />
                      <textarea
                        className="form-textarea mt-4"
                        placeholder="Enter Description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, 'description', e.target.value)
                        }
                      ></textarea>
                    </td>
                    <td>
                      <input 
                        id={`item-qty-${item.id}`}

                        type="number"
                        className="form-input w-32"
                        min={0}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, 'quantity', Number(e.target.value))
                        }
                      />
                    </td>
                    <td>
                      <input
                        id={`item-price-${item.id}`}

                        type="number"
                        className="form-input w-32"
                        min={0}
                        value={item.amount}
                        onChange={(e) =>
                          updateItem(item.id, 'amount', Number(e.target.value))
                        }
                      />
                    </td>
                    <td>
                      {currencySymbols[selectedCurrency]}
                      {(item.quantity * item.amount).toFixed(2)}
                    </td>
                    <td>
                      <button type="button" onClick={() => removeItem(item.id)}>
                        <IconX className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between sm:flex-row flex-col mt-6 px-4">
            <button
              id="add-item-button"
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '0.875rem', height: '116%', minWidth: 'auto' }}
              onClick={addItem}
            >
              Add Item
            </button>

            <div className="sm:w-2/5 space-y-2">
              <div className="flex justify-between">
                Subtotal <span>{currencySymbols[selectedCurrency]}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                Tax({tax}%) <span>{currencySymbols[selectedCurrency]}{(subtotal * tax / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                Shipping Rate({currencySymbols[selectedCurrency]}) 
                <span>{currencySymbols[selectedCurrency]}{shippingCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                Discount({discount}%) 
                <span>{currencySymbols[selectedCurrency]}{(subtotal * discount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                Total 
                <span>{currencySymbols[selectedCurrency]}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 px-4">
          <label>Notes</label>
          <textarea
            className="form-textarea min-h-[130px]"
            placeholder="Notes..."
            value={params.notes}
            onChange={(e) => setParams({ ...params, notes: e.target.value })}
          ></textarea>
        </div>
      </div>

      {/* Sidebar */}
      <div className="xl:w-96 w-full xl:mt-0 mt-6">
        <div className="panel mb-5">
          <label>Currency</label>
          <select
            className="form-select"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {currencyList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <label>Tax(%)</label>
              <input
                type="number"
                className="form-input"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Discount(%)</label>
              <input
                type="number"
                className="form-input"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="mt-4">
            <label>Shipping Charge({currencySymbols[selectedCurrency]})</label>
            <input
              type="number"
              className="form-input"
              value={shippingCharge}
              onChange={(e) => setShippingCharge(Number(e.target.value))}
            />
          </div>

          <div className="mt-4">
            <label>Accept Payment Via</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment</option>
              <option value="bank">Bank Account</option>
              <option value="paypal">Paypal</option>
              <option value="upi">UPI Transfer</option>
            </select>
          </div>
        </div>

        <div className="panel grid xl:grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
          <button className="btn btn-success w-full gap-2" onClick={handleSave}>
            <IconSave /> Save
          </button>
          {/* <button className="btn btn-info w-full gap-2">
            <IconSend /> Send Invoice
          </button> */}
          {/* <Link
            to={`/apps/invoice/preview/${id}`}
            className="btn btn-primary w-full gap-2"
          >
            <IconEye /> Preview
          </Link> */}

          {/* <button className="btn btn-secondary w-full gap-2">
            <IconDownload /> Download
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Edit;
