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
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    dispatch(setPageTitle('Employee Preview'));

    if (!id) return;

    axios
      .get(`https://cybitbackend.onrender.com/api/employees/${id}`)
      .then((res) => {
        if (res.data.success && res.data.data) {
          setEmployee(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to fetch employee', err));
  }, [dispatch, id]);

  const exportTable = () => window.print();

  if (!employee) return <div>Loading...</div>;

  const currencySymbols: Record<string, string> = {
    "USD": "$",
    "USD - US Dollar": "$",
    "GBP - British Pound": "£",
    "IDR - Indonesian Rupiah": "Rp",
    "INR": "₹",
    "BRL - Brazilian Real": "R$",
    "EUR": "€",
    "TRY - Turkish Lira": "₺",
  };
  const currency = currencySymbols[employee.currency] || employee.currency || "$";

  return (
    <div>
      {/* Action Buttons */}
      <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
        <button type="button" className="btn btn-info gap-2">
          <IconSend /> Send
        </button>
        <button type="button" className="btn btn-primary gap-2" onClick={exportTable}>
          <IconPrinter /> Print
        </button>
        <button type="button" className="btn btn-success gap-2">
          <IconDownload /> Download
        </button>
        <Link to={`/apps/employee/edit/${employee._id}`} className="btn btn-warning gap-2">
          <IconEdit /> Edit
        </Link>
      </div>

      <div className="panel p-4">
        {/* Header */}
        <div className="flex justify-between flex-wrap gap-4">
          <div className="text-2xl font-semibold uppercase">{employee.name}</div>
          <div className="shrink-0">
            <img src={employee.companyLogo || '/assets/images/cybblackpink.png'} alt="Logo" className="w-14" />
          </div>
        </div>

        {/* Employee Details */}
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Personal Details</h4>
            <div>Employee Number: {employee.employeeNumber}</div>
            <div>Department: {employee.department}</div>
            <div>Designation: {employee.designation}</div>
            <div>Date of Joining: {new Date(employee.dateOfJoining).toLocaleDateString()}</div>
            <div>Mobile Number: {employee.mobileNumber}</div>
            <div>Gender: {employee.gender}</div>
            <div>Father Name: {employee.fatherName}</div>
            <div>Mother Name: {employee.motherName}</div>
            <div>Marital Status: {employee.maritalStatus}</div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Address</h4>
            <div>Current: {employee.currentAddressLine1}, {employee.currentCity}, {employee.currentState}, {employee.currentCountry}</div>
            <div>Permanent: {employee.permanentAddressLine1}, {employee.permanentCity}, {employee.permanentState}, {employee.permanentCountry}</div>
          </div>
        </div>

        {/* Bank & Salary */}
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Bank Details</h4>
            <div>Bank Name: {employee.bankName}</div>
            <div>Account Number: {employee.accountNumber}</div>
            <div>IFSC Code: {employee.ifscCode}</div>
            <div>PF Account: {employee.pfAccount}</div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Salary</h4>
            <div>Basic: {currency} {employee.basic}</div>
            <div>HRA: {currency} {employee.hra}</div>
            <div>SA: {currency} {employee.sa}</div>
            <div>PT: {currency} {employee.pt}</div>
            <div>PF: {currency} {employee.pfEc}</div>
            <div>TDS: {currency} {employee.tds}</div>
            <div>Other Deduction: {currency} {employee.deduction}</div>
            <div className="font-semibold mt-2">Total Salary: {currency} {employee.salary}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
