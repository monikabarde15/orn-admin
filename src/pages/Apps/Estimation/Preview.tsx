import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconSend from '../../../components/Icon/IconSend';
import IconPrinter from '../../../components/Icon/IconPrinter';
import IconDownload from '../../../components/Icon/IconDownload';
import IconEdit from '../../../components/Icon/IconEdit';
import axios from 'axios';

const Preview = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    dispatch(setPageTitle('Invoice Preview'));

    if (!id) return;

    axios
      .get(`https://cybitbackend.onrender.com/api/estimation/${id}`)
      .then((res) => {
        if (res.data.success && res.data.invoice) {
          setInvoice(res.data.invoice);
        }
      })
      .catch((err) => console.error('Failed to fetch invoice', err));
  }, [dispatch, id]);

  const exportTable = () => {
    window.print();
  };

  if (!invoice) return <div>Loading...</div>;

  const subtotal = invoice.items?.reduce(
    (acc: number, item: any) => acc + item.amount * item.quantity,
    0
  );
  const total = subtotal + (subtotal * invoice.tax) / 100 + invoice.shippingCharge - (subtotal * invoice.discount) / 100;

  return (
    <div>
      <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
        <button type="button" className="btn btn-info gap-2">
          <IconSend /> Send Invoice
        </button>
        <button type="button" className="btn btn-primary gap-2" onClick={exportTable}>
          <IconPrinter /> Print
        </button>
        <button type="button" className="btn btn-success gap-2">
          <IconDownload /> Download
        </button>
        <Link to={`/apps/invoice/edit/${invoice._id}`} className="btn btn-warning gap-2">
          <IconEdit /> Edit
        </Link>
      </div>

      <div className="panel">
        {/* Header */}
        <div className="flex justify-between flex-wrap gap-4 px-4">
          <div className="text-2xl font-semibold uppercase">Invoice</div>
          <div className="shrink-0">
            <img src="/assets/images/logo.svg" alt="img" className="w-14 ltr:ml-auto rtl:mr-auto" />
          </div>
        </div>

        <div className="ltr:text-right rtl:text-left px-4">
          <div className="space-y-1 mt-6 text-white-dark">
            <div>13 Tetrick Road, Cypress Gardens, Florida, 33884, US</div>
            <div>vristo@gmail.com</div>
            <div>+1 (070) 123-4567</div>
          </div>
        </div>

        <hr className="border-white-light dark:border-[#1b2e4b] my-6" />

        {/* Bill To & Payment Details */}
        <div className="flex justify-between lg:flex-row flex-col gap-6 flex-wrap px-4">
          <div className="flex-1">
            <div className="space-y-1 text-white-dark">
              <div>Issue For:</div>
              <div className="text-black dark:text-white font-semibold">{invoice.billing.name}</div>
              <div>{invoice.billing.address}</div>
              <div>{invoice.billing.email}</div>
              <div>{invoice.billing.phone}</div>
            </div>
          </div>
          <div className="flex justify-between sm:flex-row flex-col gap-6 lg:w-2/3">
            <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">Invoice :</div>
                <div>#{invoice.invoiceNumber}</div>
              </div>
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">Issue Date :</div>
                <div>{new Date(invoice.invoiceDate).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">Due Date :</div>
                <div>{new Date(invoice.dueDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">Bank Name:</div>
                <div className="whitespace-nowrap">{invoice.paymentDetails.bankName}</div>
              </div>
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">Account Number:</div>
                <div>{invoice.paymentDetails.accountNumber}</div>
              </div>
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">SWIFT Code:</div>
                <div>{invoice.paymentDetails.swiftNumber || '-'}</div>
              </div>
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">IBAN:</div>
                <div>{invoice.paymentDetails.ibanNumber || '-'}</div>
              </div>
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">Country:</div>
                <div>{invoice.paymentDetails.country || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="table-responsive mt-6 px-4">
          <table className="table-striped w-full">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>ITEMS</th>
                <th>QTY</th>
                <th className="ltr:text-right rtl:text-left">PRICE</th>
                <th className="ltr:text-right rtl:text-left">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: any, index: number) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.title || '-'}</td>
                  <td>{item.quantity}</td>
                  <td className="ltr:text-right rtl:text-left">${item.amount}</td>
                  <td className="ltr:text-right rtl:text-left">${item.amount * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="grid sm:grid-cols-2 grid-cols-1 px-4 mt-6">
          <div></div>
          <div className="ltr:text-right rtl:text-left space-y-2">
            <div className="flex items-center">
              <div className="flex-1">Subtotal</div>
              <div className="w-[37%]">${subtotal}</div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">Tax</div>
              <div className="w-[37%]">${(subtotal * invoice.tax) / 100}</div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">Shipping Rate</div>
              <div className="w-[37%]">${invoice.shippingCharge}</div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">Discount</div>
              <div className="w-[37%]">${(subtotal * invoice.discount) / 100}</div>
            </div>
            <div className="flex items-center font-semibold text-lg">
              <div className="flex-1">Grand Total</div>
              <div className="w-[37%]">${total}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
