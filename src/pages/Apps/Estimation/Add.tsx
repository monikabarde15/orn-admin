import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconX from '../../../components/Icon/IconX';
import IconDownload from '../../../components/Icon/IconDownload';
import IconEye from '../../../components/Icon/IconEye';
import IconSend from '../../../components/Icon/IconSend';
import IconSave from '../../../components/Icon/IconSave';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import toast

const Add = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
const [saving, setSaving] = useState(false);

    const [items, setItems] = useState<any>([
        { id: 1, title: '', description: '', rate: 0, quantity: 0, amount: 0 },
    ]);
     const [selectedCurrency, setSelectedCurrency] = useState("USD - US Dollar");

    useEffect(() => {
        dispatch(setPageTitle('Invoice Add'));
    }, [dispatch]);

    const currencyList = [
        'USD - US Dollar',
        'GBP - British Pound',
        'IDR - Indonesian Rupiah',
        'INR - Indian Rupee',
        'BRL - Brazilian Real',
        'EUR - Germany (Euro)',
        'TRY - Turkish Lira',
    ];
    const currencySymbols: any = {
        "USD - US Dollar": "$",
        "GBP - British Pound": "£",
        "IDR - Indonesian Rupiah": "Rp",
        "INR - Indian Rupee": "₹",
        "BRL - Brazilian Real": "R$",
        "EUR - Germany (Euro)": "€",
        "TRY - Turkish Lira": "₺",
    };

    const addItem = () => {
        let maxId = items.length
            ? items.reduce((max: number, i: any) => (i.id > max ? i.id : max), items[0].id)
            : 0;
        setItems([...items, { id: maxId + 1, title: '', description: '', rate: 0, quantity: 0, amount: 0 }]);
    };

    const removeItem = (item: any) => {
        setItems(items.filter((i: any) => i.id !== item.id));
    };

    const changeQuantityPrice = (type: string, value: string, id: number) => {
        const list = [...items];
        const item = list.find((i: any) => i.id === id);
        if (!item) return;
        if (type === 'quantity') item.quantity = Number(value);
        if (type === 'price') item.amount = Number(value);
        setItems(list);
    };
const validateForm = () => {
    // Collect values from DOM for simplicity here, can be refactored with controlled inputs
   const requiredFields = [
    { id: 'number', name: 'Invoice Number' },
    { id: 'invoiceLabel', name: 'Invoice Label' },
    { id: 'startDate', name: 'Invoice Date' },
    { id: 'dueDate', name: 'Due Date' },
    { id: 'reciever-name', name: 'Name' },
    { id: 'reciever-email', name: 'Email' },
    { id: 'reciever-address', name: 'Address' },
    { id: 'acno', name: 'Account Number' },
    { id: 'bank-name', name: 'Bank Name' },
    { id: 'swiftNumber', name: 'SWIFT Number' },
    { id: 'ibanNumber', name: 'IBAN Number' },
    { id: 'country', name: 'Country' },
    { id: 'tax', name: 'Tax' },
    { id: 'discount', name: 'Discount' },
    { id: 'shipping-charge', name: 'Shipping Charge' },
    { id: 'currency', name: 'Currency' },
    {id:"payment-method",name:"Accept Payment Via"},
    { id: 'notes', name: 'Notes' },
  ];

    for (const field of requiredFields) {
      // @ts-ignore
      const el = document.getElementById(field.id);
      console.log('el=',el);
      if (!el) {
        alert(`Missing form element: ${field.name}`);
        return false;
      }
      // value depends on element type
      const value = (el as HTMLInputElement | HTMLSelectElement).value.trim();
      if (!value) {
           const el = document.getElementById(field.id);
            if (!el) {
            console.error('Element not found');
            return false;
            }

            const parent = el.parentNode;
            if (!parent) {
            console.error('Parent node not found');
            return false;
            }

            let errorDiv = document.getElementById(field.id + '-error-message');
            if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = field.id + '-error-message';
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '0.9em';
            errorDiv.style.marginTop = '4px';
            errorDiv.style.marginLeft = '0px';
            errorDiv.style.display = 'block';
            parent.appendChild(errorDiv);
            }

            errorDiv.innerHTML = ``;
            el.focus();

            return false;


      }
      if (field.name === 'Email') {
        // simple email regex validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(value)) {
          alert('Please enter a valid Email');
          return false;
        }
      }
    

    }
    return true;
  };
  
    // --- FIXED saveInvoice INSIDE COMPONENT ---
    const saveInvoice = async () => {
        if (!validateForm()) return;
        setSaving(true);
    const data = {
        invoiceNumber: (document.getElementById('number') as HTMLInputElement).value,
        invoiceLabel: (document.getElementById('invoiceLabel') as HTMLInputElement).value,
        invoiceDate: (document.getElementById('startDate') as HTMLInputElement).value,
        dueDate: (document.getElementById('dueDate') as HTMLInputElement).value,
        billing: {
            name: (document.getElementById('reciever-name') as HTMLInputElement).value,
            email: (document.getElementById('reciever-email') as HTMLInputElement).value,
            address: (document.getElementById('reciever-address') as HTMLInputElement).value,
            phone: (document.getElementById('acno') as HTMLInputElement).value, // Or phone input
        },
        paymentDetails: {
            accountNumber: (document.getElementById('acno') as HTMLInputElement).value,
            bankName: (document.getElementById('bank-name') as HTMLInputElement).value,
            swiftNumber: "", // optional
            ibanNumber: "", // optional
            country: "", // optional
        },
        items: items.map((i: any) => ({
            title: i.title,
            description: i.description,
            quantity: i.quantity,
            amount: i.amount,
        })),
        tax: Number((document.getElementById('tax') as HTMLInputElement).value),
        discount: Number((document.getElementById('discount') as HTMLInputElement).value),
        shippingCharge: Number((document.getElementById('shipping-charge') as HTMLInputElement).value),
        currency: (document.getElementById('currency') as HTMLSelectElement).value,
        notes: (document.getElementById('notes') as HTMLTextAreaElement).value,
    };

    try {
        const res = await axios.post('https://cybitbackend.onrender.com/api/estimation', data);
        if (res.data.success) {
            // alert('Estimation saved! ID: ' + res.data.invoice._id);
               setTimeout(() => {
                   toast.success('Estimation saved! ID: ' + res.data.invoice._id);
                            navigate('/apps/Estimation/list'); // yahan apna route de jahan redirect karna hai
                  }, 1000);
        }
    } catch (err) {
        console.error(err);
        alert('Error saving invoice.');
    }
};


    return (
        <div className="flex xl:flex-row flex-col gap-2.5">
            {/* LEFT PANEL */}
            <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                {/* Invoice Info */}
                <div className="flex justify-between flex-wrap px-4">
                    <div className="mb-6 lg:w-1/2 w-full">
                        <div className="flex items-center text-black dark:text-white shrink-0">
                            <img src="/assets/images/cybblackpink.png" alt="img" className="w-14" />
                        </div>
                        <div className="space-y-1 mt-6 text-gray-500 dark:text-gray-400">
                         <div>G-9/85,Sangam Vihar New Delhi-110080</div>
                        <div>info@cybite.in</div>
                        <div>+91 8210543772</div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full lg:max-w-fit">
                        {/* Invoice Number */}
                        <div className="flex items-center">
                            <label htmlFor="number" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Invoice Number</label>
                            <input id="number" type="text" className="form-input lg:w-[250px] w-2/3" placeholder="#8801" />
                        </div>
                        {/* Invoice Label */}
                        <div className="flex items-center mt-4">
                            <label htmlFor="invoiceLabel" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Invoice Label</label>
                            <input id="invoiceLabel" type="text" className="form-input lg:w-[250px] w-2/3" placeholder="Enter Invoice Label" />
                        </div>
                        {/* Dates */}
                        <div className="flex items-center mt-4">
                            <label htmlFor="startDate" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Invoice Date</label>
                            <input id="startDate" type="date" className="form-input lg:w-[250px] w-2/3" />
                        </div>
                        <div className="flex items-center mt-4">
                            <label htmlFor="dueDate" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Due Date</label>
                            <input id="dueDate" type="date" className="form-input lg:w-[250px] w-2/3" />
                        </div>
                    </div>
                </div>

                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />

                {/* Bill To & Payment Details */}
                <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        {/* Bill To */}
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Bill To :-</div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Name</label>
                                <input id="reciever-name" type="text" className="form-input flex-1" placeholder="Enter Name" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-email" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Email</label>
                                <input id="reciever-email" type="email" className="form-input flex-1" placeholder="Enter Email" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-address" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Address</label>
                                <input id="reciever-address" type="text" className="form-input flex-1" placeholder="Enter Address" />
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="lg:w-1/2 w-full">
                            <div className="text-lg">Payment Details:</div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="acno" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Account Number</label>
                                <input id="acno" type="text" className="form-input flex-1" placeholder="Enter Account Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="bank-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Bank Name</label>
                                <input id="bank-name" type="text" className="form-input flex-1" placeholder="Enter Bank Name" />
                            </div>
                              <div className="mt-4 flex items-center">
                                <label htmlFor="swiftNumber" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">SWIFT Number</label>
                                <input id="swiftNumber" type="text" className="form-input flex-1" placeholder="Enter SWIFT Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="ibanNumber" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">IBAN Number</label>
                                <input id="ibanNumber" type="text" className="form-input flex-1" placeholder="Enter IBAN Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Country</label>
                                <select id="country"
                                    className="form-select flex-1">
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
                </div>

                {/* Items Table */}
                <div className="mt-8">
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
                                {items.length <= 0 && (
                                    <tr>
                                        <td colSpan={5} className="!text-center font-semibold">No Item Available</td>
                                    </tr>
                                )}
                                {items.map((item: any) => (
                                    <tr className="align-top" key={item.id}>
                                        <td>
                                            <input type="text" className="form-input min-w-[200px]" placeholder="Enter Item Name" defaultValue={item.title} />
                                            <textarea className="form-textarea mt-4" placeholder="Enter Description" defaultValue={item.description}></textarea>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-input w-32"
                                                placeholder="Quantity"
                                                min={0}
                                                defaultValue={item.quantity}
                                                onChange={(e) => changeQuantityPrice('quantity', e.target.value, item.id)}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="number"
                                                className="form-input w-32"
                                                placeholder="Price"
                                                min={0}
                                                defaultValue={item.amount}
                                                onChange={(e) => changeQuantityPrice('price', e.target.value, item.id)}
                                            />
                                        </td>
                                         <td>
                                            {currencySymbols[selectedCurrency]}{item.quantity * item.amount}
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => removeItem(item)}>
                                                <IconX className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between sm:flex-row flex-col mt-6 px-4">
                        <div className="sm:mb-0 mb-6">
                            <button type="button" className="btn btn-primary" onClick={addItem}>
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="mt-8 px-4">
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" className="form-textarea min-h-[130px]" placeholder="Notes...."></textarea>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="xl:w-96 w-full xl:mt-0 mt-6">
                <div className="panel mb-5">
                    <label htmlFor="currency">Currency</label>
                    <select id="currency" name="currency"  value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}  className="form-select">
                        {currencyList.map((i) => (
                            <option key={i}>{i}</option>
                        ))}
                    </select>

                    <div className="mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="tax">Tax(%) </label>
                            <input id="tax" type="number" name="tax" className="form-input" defaultValue={0} />
                        </div>
                        <div>
                            <label htmlFor="discount">Discount(%) </label>
                            <input id="discount" type="number" name="discount" className="form-input" defaultValue={0} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="shipping-charge">Shipping Charge({currencySymbols[selectedCurrency]}) </label>
                        <input id="shipping-charge" type="number" name="shipping-charge" className="form-input" defaultValue={0} />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="payment-method">Accept Payment Via</label>
                        <select id="payment-method" name="payment-method" className="form-select">
                            <option value="">Select Payment</option>
                            <option value="bank">Bank Account</option>
                            <option value="paypal">Paypal</option>
                            <option value="upi">UPI Transfer</option>
                        </select>
                    </div>
                </div>

                <div className="panel">
                    <div className="grid xl:grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
                        <button type="button" className="btn btn-success w-full gap-2" disabled={saving} onClick={saveInvoice}>
                            <IconSave className="ltr:mr-2 rtl:ml-2 shrink-0" /> Save
                        </button>

                        {/* <button type="button" className="btn btn-info w-full gap-2">
                            <IconSend className="ltr:mr-2 rtl:ml-2 shrink-0" /> Send Invoice
                        </button> */}

                        {/* <Link to="/apps/Estimation/preview" className="btn btn-primary w-full gap-2">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" /> Preview
                        </Link>

                        <button type="button" className="btn btn-secondary w-full gap-2">
                            <IconDownload className="ltr:mr-2 rtl:ml-2 shrink-0" /> Download
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Add;
