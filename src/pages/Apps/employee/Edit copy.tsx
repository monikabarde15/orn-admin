import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconX from '../../../components/Icon/IconX';
import IconDownload from '../../../components/Icon/IconDownload';
import IconEye from '../../../components/Icon/IconEye';
import IconSend from '../../../components/Icon/IconSend';
import IconSave from '../../../components/Icon/IconSave';

interface Employee {
  _id?: string;
  employeeNumber: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobileNumber: string;
  gender: string;
  fatherName: string;
  motherName: string;
  contactNumber: string;
  maritalStatus: string;
  currentAddressLine1: string;
  currentCity: string;
  currentDistrict: string;
  currentState: string;
  currentPostal: string;
  currentCountry: string;
  currentLandmark: string;
  permanentAddressLine1: string;
  permanentCity: string;
  permanentDistrict: string;
  permanentState: string;
  permanentPostal: string;
  permanentCountry: string;
  permanentLandmark: string;
  aadharNumber: string;
  panNumber: string;
  pfAccount: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  basic: string;
  hra: string;
  sa: string;
  pt: string;
  pfEc: string;
  tds: string;
  previousCompany: string;
  previousPosition: string;
  previousSalary: string;
  previousDOR: string;
  notes: string;
  tax: number;
  deduction: number;
  salary: number;
  currency: string;
}

const currencyList = [
  'USD - US Dollar',
  'GBP - British Pound',
  'IDR - Indonesian Rupiah',
  'INR - Indian Rupee',
  'BRL - Brazilian Real',
  'EUR - Germany (Euro)',
  'TRY - Turkish Lira',
];

const currencySymbols: Record<string,string> = {
  'USD - US Dollar': '$',
  'GBP - British Pound': '£',
  'IDR - Indonesian Rupiah': 'Rp',
  'INR - Indian Rupee': '₹',
  'BRL - Brazilian Real': 'R$',
  'EUR - Germany (Euro)': '€',
  'TRY - Turkish Lira': '₺',
};

const defaultEmployee: Employee = {
  employeeNumber: '',
  department: '',
  designation: '',
  dateOfJoining: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  mobileNumber: '',
  gender: '',
  fatherName: '',
  motherName: '',
  contactNumber: '',
  maritalStatus: '',
  currentAddressLine1: '',
  currentCity: '',
  currentDistrict: '',
  currentState: '',
  currentPostal: '',
  currentCountry: '',
  currentLandmark: '',
  permanentAddressLine1: '',
  permanentCity: '',
  permanentDistrict: '',
  permanentState: '',
  permanentPostal: '',
  permanentCountry: '',
  permanentLandmark: '',
  aadharNumber: '',
  panNumber: '',
  pfAccount: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  basic: '',
  hra: '',
  sa: '',
  pt: '',
  pfEc: '',
  tds: '',
  previousCompany: '',
  previousPosition: '',
  previousSalary: '',
  previousDOR: '',
  notes: '',
  tax: 0,
  deduction: 0,
  salary: 0,
  currency: 'USD - US Dollar',
};

const Edit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee>(defaultEmployee);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [companyLogoFile, setCompanyLogoFile] = useState<File>();

  useEffect(() => {
    dispatch(setPageTitle(id ? 'Edit Employee' : 'Add Employee'));

    if (id) {
      axios
        .get(`http://localhost:5000/api/employees/${id}`)
        .then(({ data }) => {
          const emp = data.data;
          setEmployee({
            ...defaultEmployee,
            _id: emp._id,
            employeeNumber: emp.employeeNumber,
            department: emp.department,
            designation: emp.designation,
            dateOfJoining: emp.dateOfJoining.slice(0, 10),
            name: emp.name,
            email: emp.email,
            password: '',
            confirmPassword: '',
            mobileNumber: emp.mobileNumber,
            gender: emp.gender,
            fatherName: emp.fatherName,
            motherName: emp.motherName,
            contactNumber: emp.contactNumber,
            maritalStatus: emp.maritalStatus,
            currentAddressLine1: emp.currentAddress?.line1 || '',
            currentCity: emp.currentAddress?.city || '',
            currentDistrict: emp.currentAddress?.district || '',
            currentState: emp.currentAddress?.state || '',
            currentPostal: emp.currentAddress?.postal || '',
            currentCountry: emp.currentAddress?.country || '',
            currentLandmark: emp.currentAddress?.landmark || '',
            permanentAddressLine1: emp.permanentAddress?.line1 || '',
            permanentCity: emp.permanentAddress?.city || '',
            permanentDistrict: emp.permanentAddress?.district || '',
            permanentState: emp.permanentAddress?.state || '',
            permanentPostal: emp.permanentAddress?.postal || '',
            permanentCountry: emp.permanentAddress?.country || '',
            permanentLandmark: emp.permanentAddress?.landmark || '',
            aadharNumber: emp.aadharNumber,
            panNumber: emp.panNumber,
            pfAccount: emp.pfAccount || '',
            bankName: emp.bankName || '',
            accountNumber: emp.accountNumber || '',
            ifscCode: emp.ifscCode || '',
            basic: emp.basic?.toString() || '',
            hra: emp.hra?.toString() || '',
            sa: emp.sa?.toString() || '',
            pt: emp.pt?.toString() || '',
            pfEc: emp.pfEc?.toString() || '',
            tds: emp.tds?.toString() || '',
            previousCompany: emp.previousCompany || '',
            previousPosition: emp.previousPosition || '',
            previousSalary: emp.previousSalary?.toString() || '',
            previousDOR: emp.previousDOR || '',
            notes: emp.notes || '',
            tax: emp.tax,
            deduction: emp.deduction,
            salary: emp.salary,
            currency:
              emp.currency && currencyList.find(c => c.startsWith(emp.currency))
                ? currencyList.find(c => c.startsWith(emp.currency))!
                : defaultEmployee.currency,
          });
          if (emp.companyLogo) setLogoPreview(emp.companyLogo);
        })
        .catch(console.error);
    }
  }, [dispatch, id]);

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    const fieldMap: Record<string, keyof Employee> = {
      number: 'employeeNumber',
      invoiceLabel: 'department',
      desingnation: 'designation',
      dateOfJoining: 'dateOfJoining',
      name: 'name',
      'reciever-email': 'email',
      'password-new': 'password',
      'confirm-password': 'confirmPassword',
      mobile_number: 'mobileNumber',
      gender: 'gender',
      'father-name': 'fatherName',
      mother_name: 'motherName',
      contact_number: 'contactNumber',
      'marital-status': 'maritalStatus',
      'current-address-line1': 'currentAddressLine1',
      'current-city': 'currentCity',
      'current-district': 'currentDistrict',
      'current-state': 'currentState',
      'current-postal': 'currentPostal',
      'current-country': 'currentCountry',
      'current-landmark': 'currentLandmark',
      'permanent-address-line1': 'permanentAddressLine1',
      'permanent-city': 'permanentCity',
      'permanent-district': 'permanentDistrict',
      'permanent-state': 'permanentState',
      'permanent-postal': 'permanentPostal',
      'permanent-country': 'permanentCountry',
      'permanent-landmark': 'permanentLandmark',
      'aadhar-number': 'aadharNumber',
      'pan-number': 'panNumber',
      'pf-account': 'pfAccount',
      'bank-name': 'bankName',
      acno: 'accountNumber',
      'ifsc-code': 'ifscCode',
      basic: 'basic',
      hra: 'hra',
      sa: 'sa',
      pt: 'pt',
      'pf-ec': 'pfEc',
      tds: 'tds',
      'previous-compnay': 'previousCompany',
      'previous-posstion': 'previousPosition',
      'previous-salary': 'previousSalary',
      'previous-dor': 'previousDOR',
      notes: 'notes',
      tax: 'tax',
      deduction: 'deduction',
      Salary: 'salary',
      currency: 'currency',
    };
    const key = fieldMap[id];
    if (!key) return;
    setEmployee(prev => ({
      ...prev,
      [key]: key === 'tax' || key === 'deduction' || key === 'salary'
        ? Number(value)
        : value,
    }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    if (!employee.employeeNumber.trim()) { alert('Enter Employee Number'); return false; }
    if (!employee.email.match(/\S+@\S+\.\S+/)) { alert('Invalid Email'); return false; }
    if (employee.password !== employee.confirmPassword) { alert('Passwords must match'); return false; }
    return true;
  };

  const saveEmployee = async () => {
    if (!validate()) return;
    const formData = new FormData();
    Object.entries(employee).forEach(([k, v]) => {
      if (k === 'confirmPassword') return;
      formData.append(k, v?.toString() ?? '');
    });
    if (companyLogoFile) formData.append('companyLogo', companyLogoFile);

    try {
      const method = id ? 'put' : 'post';
      const url = id
        ? `http://localhost:5000/api/employees/${id}`
        : 'http://localhost:5000/api/employees';
      await axios({ method, url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
      alert(id ? 'Employee updated!' : 'Employee created!');
      navigate('/apps/employees');
    } catch {
      alert('Error saving employee.');
    }
  };

  return (
    <div className="flex xl:flex-row flex-col gap-2.5">
      {/* LEFT PANEL */}
      <div className="panel flex-1 py-6 px-4">
        <div className="flex items-center">
          <img
            src={logoPreview || '/assets/images/cybblackpink.png'}
            alt="Logo"
            className="w-14 h-14 rounded object-cover"
          />
          <input
            id="company-logo"
            type="file"
            accept="image/*"
            hidden
            onChange={handleLogoChange}
          />
          <label htmlFor="company-logo" className="ml-4 btn btn-sm btn-primary">
            Upload Logo
          </label>
        </div>

        {/* Employee Number, Dept, Designation, Date */}
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <label htmlFor="number" className="w-1/3">Employee #</label>
            <input
              id="number"
              type="text"
              value={employee.employeeNumber}
              onChange={handleInput}
              className="form-input flex-1"
            />
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="invoiceLabel" className="w-1/3">Department</label>
            <input
              id="invoiceLabel"
              type="text"
              value={employee.department}
              onChange={handleInput}
              className="form-input flex-1"
            />
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="desingnation" className="w-1/3">Designation</label>
            <input
              id="desingnation"
              type="text"
              value={employee.designation}
              onChange={handleInput}
              className="form-input flex-1"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="dateOfJoining" className="w-1/3">Date of Joining</label>
            <input
              id="dateOfJoining"
              type="date"
              value={employee.dateOfJoining}
              onChange={handleInput}
              className="form-input flex-1"
            />
          </div>
        </div>

        <hr className="my-6" />

        {/* Personal & Contact Details */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Personal Details</h3>
            <div className="flex items-center mb-4">
              <label htmlFor="name" className="w-1/3">Name</label>
              <input
                id="name"
                type="text"
                value={employee.name}
                onChange={handleInput}
                className="form-input flex-1"
              />
            </div>
            <div className="flex items-center mb-4">
              <label htmlFor="reciever-email" className="w-1/3">Email</label>
              <input
                id="reciever-email"
                type="email"
                value={employee.email}
                onChange={handleInput}
                className="form-input flex-1"
              />
            </div>
            <div className="flex items-center mb-4">
              <label htmlFor="password-new" className="w-1/3">Password</label>
              <input
                id="password-new"
                type="password"
                value={employee.password}
                onChange={handleInput}
                className="form-input flex-1"
              />
            </div>
            <div className="flex items-center mb-4">
              <label htmlFor="confirm-password" className="w-1/3">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={employee.confirmPassword}
                onChange={handleInput}
                className="form-input flex-1"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="mobile_number" className="w-1/3">Mobile</label>
              <input
                id="mobile_number"
                type="text"
                value={employee.mobileNumber}
                onChange={handleInput}
                className="form-input flex-1"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Additional Details</h3>
            <div className="flex items-center mb-4">
              <label htmlFor="gender" className="w-1/3">Gender</label>
              <select
                id="gender"
                value={employee.gender}
                onChange={handleInput}
                className="form-select flex-1"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="flex items-center mb-4">
              <label htmlFor="father-name" className="w-1/3">Father’s Name</label>
              <input
                id="father-name"
                type="text"
                value={employee.fatherName}
                onChange={handleInput}
                className="form-input flex-1"
              />
            </div>
            <div className="flex items-center mb-4">
              <label htmlFor="mother_name" className="w-1/3">Mother’s Name</label>
              <input
                id="mother_name"
                type="text"
                value={employee.motherName}
                onChange={handleInput}
                className="form-input flex-1"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="contact_number" className="w-1/3">Contact #</label>
              <input
                id="contact_number"
                type="text"
                value={employee.contactNumber}
                onChange={handleInput}
                className="form-input flex-1"
              />
            </div>
          </div>
        </div>

        <hr className="my-6" />

        {/* Address Sections */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-4">Current Address</h3>
            {[
              ['current-address-line1', 'currentAddressLine1', 'Line 1'],
              ['current-city', 'currentCity', 'City'],
              ['current-district', 'currentDistrict', 'District'],
              ['current-state', 'currentState', 'State'],
              ['current-postal', 'currentPostal', 'Postal Code'],
              ['current-country', 'currentCountry', 'Country'],
              ['current-landmark', 'currentLandmark', 'Landmark'],
            ].map(([id, key, label]) => (
              <div className="flex items-center mb-3" key={id}>
                <label htmlFor={id} className="w-1/3">{label}</label>
                {id.endsWith('-country') ? (
                  <select
                    id={id}
                    value={(employee as any)[key]}
                    onChange={handleInput}
                    className="form-select flex-1"
                  >
                    <option value="">Select</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                ) : (
                  <input
                    id={id}
                    type="text"
                    value={(employee as any)[key]}
                    onChange={handleInput}
                    className="form-input flex-1"
                  />
                )}
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-4">Permanent Address</h3>
            {[
              ['permanent-address-line1', 'permanentAddressLine1', 'Line 1'],
              ['permanent-city', 'permanentCity', 'City'],
              ['permanent-district', 'permanentDistrict', 'District'],
              ['permanent-state', 'permanentState', 'State'],
              ['permanent-postal', 'permanentPostal', 'Postal Code'],
              ['permanent-country', 'permanentCountry', 'Country'],
              ['permanent-landmark', 'permanentLandmark', 'Landmark'],
            ].map(([id, key, label]) => (
              <div className="flex items-center mb-3" key={id}>
                <label htmlFor={id} className="w-1/3">{label}</label>
                {id.endsWith('-country') ? (
                  <select
                    id={id}
                    value={(employee as any)[key]}
                    onChange={handleInput}
                    className="form-select flex-1"
                  >
                    <option value="">Select</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                ) : (
                  <input
                    id={id}
                    type="text"
                    value={(employee as any)[key]}
                    onChange={handleInput}
                    className="form-input flex-1"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6" />

        {/* Bank, Earnings & Deductions, Previous Employment */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-4">Bank Details</h3>
            {[
              ['aadhar-number', 'aadharNumber', 'Aadhar #'],
              ['pan-number', 'panNumber', 'PAN #'],
              ['pf-account', 'pfAccount', 'PF A/C'],
              ['bank-name', 'bankName', 'Bank Name'],
              ['acno', 'accountNumber', 'Account #'],
              ['ifsc-code', 'ifscCode', 'IFSC'],
            ].map(([id, key, label]) => (
              <div className="flex items-center mb-3" key={id}>
                <label htmlFor={id} className="w-1/3">{label}</label>
                <input
                  id={id}
                  type="text"
                  value={(employee as any)[key]}
                  onChange={handleInput}
                  className="form-input flex-1"
                />
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-4">Earnings</h3>
            {[
              ['basic', 'basic', 'Basic'],
              ['hra', 'hra', 'HRA'],
              ['sa', 'sa', 'Special Allowance'],
            ].map(([id, key, label]) => (
              <div className="flex items-center mb-3" key={id}>
                <label htmlFor={id} className="w-1/3">{label}</label>
                <input
                  id={id}
                  type="number"
                  value={(employee as any)[key]}
                  onChange={handleInput}
                  className="form-input flex-1"
                />
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-4">Deductions</h3>
            {[
              ['pt', 'pt', 'PT'],
              ['pf-ec', 'pfEc', 'PF EC'],
              ['tds', 'tds', 'TDS'],
            ].map(([id, key, label]) => (
              <div className="flex items-center mb-3" key={id}>
                <label htmlFor={id} className="w-1/3">{label}</label>
                <input
                  id={id}
                  type="number"
                  value={(employee as any)[key]}
                  onChange={handleInput}
                  className="form-input flex-1"
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6" />

        {/* Previous Employment */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Previous Company</h3>
          <div className="flex items-center mb-4">
            <label htmlFor="previous-compnay" className="w-1/3">Company</label>
            <input
              id="previous-compnay"
              type="text"
              value={employee.previousCompany}
              onChange={handleInput}
              className="form-input flex-1"
            />
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="previous-posstion" className="w-1/3">Position</label>
            <input
              id="previous-posstion"
              type="text"
              value={employee.previousPosition}
              onChange={handleInput}
              className="form-input flex-1"
            />
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="previous-salary" className="w-1/3">Salary</label>
            <input
              id="previous-salary"
              type="number"
              value={employee.previousSalary}
              onChange={handleInput}
              className="form-input flex-1"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="previous-dor" className="w-1/3">DOR</label>
            <input
              id="previous-dor"
              type="text"
              value={employee.previousDOR}
              onChange={handleInput}
              className="form-input flex-1"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label htmlFor="notes" className="block mb-2">Notes</label>
          <textarea
            id="notes"
            value={employee.notes}
            onChange={handleInput}
            className="form-textarea w-full"
            rows={4}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="xl:w-96 w-full space-y-6">
        <div className="panel p-4">
          <label htmlFor="currency" className="block mb-2">Currency</label>
          <select
            id="currency"
            value={employee.currency}
            onChange={handleInput}
            className="form-select w-full"
          >
            {currencyList.map(cur => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tax">Tax (%)</label>
              <input
                id="tax"
                type="number"
                value={employee.tax}
                onChange={handleInput}
                className="form-input w-full"
              />
            </div>
            <div>
              <label htmlFor="deduction">Deduction (%)</label>
              <input
                id="deduction"
                type="number"
                value={employee.deduction}
                onChange={handleInput}
                className="form-input w-full"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="Salary">Salary ({currencySymbols[employee.currency]})</label>
            <input
              id="Salary"
              type="number"
              value={employee.salary}
              onChange={handleInput}
              className="form-input w-full"
            />
          </div>
        </div>

        <div className="panel p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={saveEmployee}
              className="btn btn-success w-full flex items-center justify-center gap-2"
            >
              <IconSave /> Save
            </button>
            <button className="btn btn-info w-full flex items-center justify-center gap-2">
              <IconSend /> Send
            </button>
            <Link
              to={id ? `/apps/employees/preview/${id}` : '/apps/employees/preview'}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <IconEye /> Preview
            </Link>
            <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
              <IconDownload /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
