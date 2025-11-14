import { Link, useParams, useNavigate } from 'react-router-dom';

import { useEffect, useState,ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconX from '../../../components/Icon/IconX';
import IconDownload from '../../../components/Icon/IconDownload';
import IconEye from '../../../components/Icon/IconEye';
import IconSend from '../../../components/Icon/IconSend';
import IconSave from '../../../components/Icon/IconSave';
import axios from 'axios';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import toast


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
const Edit = () => {
   const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    const [employee, setEmployee] = useState<Employee>(defaultEmployee);

    const [logoPreview, setLogoPreview] = useState<string>('');
    const [companyLogoFile, setCompanyLogoFile] = useState<File>();
  

    const [items, setItems] = useState<any>([
        { id: 1, title: '', description: '', rate: 0, quantity: 0, amount: 0 },
    ]);
const [selectedCurrency, setSelectedCurrency] = useState("USD - US Dollar");
    useEffect(() => {
    dispatch(setPageTitle(id ? 'Edit Employee' : 'Add Employee'));

    if (id) {
      axios
        .get(`https://cybitbackend.onrender.com/api/employees/${id}`)
        .then(({ data }) => {
          const emp = data.data;
          console.log('emp=',emp.currentAddressLine1);
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
            currentAddressLine1: emp.currentAddressLine1,
            currentCity: emp.currentCity,
            currentDistrict: emp.currentDistrict,
            currentState: emp.currentState,
            currentPostal: emp.currentAddress || '',
            currentCountry: emp.currentCountry,
            currentLandmark: emp.currentLandmark,
            permanentAddressLine1: emp.permanentAddressLine1,
            permanentCity: emp.permanentCity,
            permanentDistrict: emp.permanentDistrict,
            permanentState: emp.permanentState,
            permanentPostal: emp.permanentAddress?.postal || '',
            permanentCountry: emp.permanentCountry,
            permanentLandmark: emp.permanentLandmark,
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
     { id: 'number', name: 'Employee Number' },
      { id: 'invoiceLabel', name: 'Department' },
      { id: 'desingnation', name: 'Designation' },
      { id: 'dateOfJoining', name: 'Date of Joining' },
      { id: 'name', name: 'Name' },
      { id: 'reciever-email', name: 'Email' },
      { id: 'mobile_number', name: 'Mobile Number' },
      { id: 'gender', name: 'Gender' },
      { id: 'father-name', name: "Father's/Husband Name" },
      { id: 'mother_name', name: "Mother's Name" },
      { id: 'contact_number', name: 'Contact Number' },
      { id: 'maritalStatus', name: 'Marital Status' },

      {id:'current-address-line1',name:"ADD Line 1"},
      {id:'current-city',name:"City / Town"},
      {id:"current-district",name:"District / County"},
      {id:"current-state",name:"State / Province / Region"},
      {id:"current-postal",name:"Postal Code / ZIP Code"},
      {id:"currentCountry",name:"Country"},
      {id:"current-landmark",name:"Nearest Landmark"},
       {id:"permanet-landmark",name:"Nearest Landmark"},
      {id:"permanent-address-line1",name:"ADD Line 1"},
      {id:"permanent-city",name:"City / Town"},
      {id:"permanent-district",name:"District / County"},
      {id:"permanent-state", name:"State / Province / Region"},
      {id:"permanent-postal",name:"Postal Code / ZIP Code"},
      {id:"permanentCountry",name:"Country"},
      {id:"aadhar-number",name:"Aadhar Number"},
      {id:"pan-number",name:"Pan Number"},
      {id:"pf-account",name:"PF A/C"},
      {id:"bank-name",name:"Bank Name"},
      {id:"acno",name:"Account Number"},
      {id:"ifsc-code",name:"IFSC Code"},
      {id:"basic",name:"Basic"},
      {id:"hra",name:"H R A"},
      {id:"sa",name:"S A"},
      {id:"pt",name:"P T"},
      {id:"pf-ec",name:"PF E C"},
      {id:"tds",name:"TDS"},
      {id:"previous-compnay",name:"Previous Compnay"},
      {id:"previous-posstion",name:"Possition"},
      {id:"previous-salary",name:"Salary"},
      {id:"previous-dor",name:"DOR"},
      {id:"notes",name:"Notes"},
      {id:"currency",name:"Currency"},
      {id:"tax",name:"Tax"},
      {id:"deduction",name:"Deduction"},
      {id:"Salary",name:"Salary"}
      // Add all other required fields here
      // Add all other required fields here
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

  // पहले formData से duplicate चेक करने के लिए जरूरी fields बनाएं
  const employeeNumber = (document.getElementById('number') as HTMLInputElement).value.trim();
  const email = (document.getElementById('reciever-email') as HTMLInputElement).value.trim();
  const aadharNumber = (document.getElementById('aadhar-number') as HTMLInputElement).value.trim();
  const panNumber = (document.getElementById('pan-number') as HTMLInputElement).value.trim();
  const mobileNumber = (document.getElementById('mobile_number') as HTMLInputElement).value.trim();
  const contactNumber = (document.getElementById('contact_number') as HTMLInputElement).value.trim();
  const accountNumber = (document.getElementById('acno') as HTMLInputElement).value.trim();

  // Duplicate check API call
  
    
    
  // If no duplicates, proceed to submit form data
  const formData = new FormData();

  // Append all fields as before
  formData.append('employeeNumber', employeeNumber);
  formData.append('department', (document.getElementById('invoiceLabel') as HTMLInputElement).value);
  formData.append('designation', (document.getElementById('desingnation') as HTMLInputElement).value);
  formData.append('dateOfJoining', (document.getElementById('dateOfJoining') as HTMLInputElement).value);
  formData.append('name', (document.getElementById('name') as HTMLInputElement).value);
  formData.append('email', email);
//   formData.append('password', (document.getElementById('password-new') as HTMLInputElement).value);
  formData.append('mobileNumber', mobileNumber);
  formData.append('gender', (document.getElementById('gender') as HTMLSelectElement).value);
  formData.append('fatherName', (document.getElementById('father-name') as HTMLInputElement).value);
  formData.append('motherName', (document.getElementById('mother_name') as HTMLInputElement).value);
  formData.append('contactNumber', contactNumber);
  formData.append('maritalStatus', (document.getElementById('maritalStatus') as HTMLSelectElement).value);

  formData.append('currentAddressLine1', (document.getElementById('current-address-line1') as HTMLSelectElement).value);
  formData.append('currentCity', (document.getElementById('current-city') as HTMLSelectElement).value);
  formData.append('currentDistrict', (document.getElementById('current-district') as HTMLSelectElement).value);
  formData.append('currentState', (document.getElementById('current-state') as HTMLSelectElement).value);
  formData.append('currentCountry', (document.getElementById('currentCountry') as HTMLSelectElement).value);
  formData.append('currentLandmark', (document.getElementById('current-landmark') as HTMLSelectElement).value);

  formData.append('permanentAddressLine1', (document.getElementById('permanent-address-line1') as HTMLSelectElement).value);
  formData.append('permanentCity', (document.getElementById('permanent-city') as HTMLSelectElement).value);
  formData.append('permanentDistrict', (document.getElementById('permanent-district') as HTMLSelectElement).value);
  formData.append('permanentState', (document.getElementById('permanent-state') as HTMLSelectElement).value);
  formData.append('permanentCountry', (document.getElementById('permanentCountry') as HTMLSelectElement).value);
  formData.append('permanentPostal', (document.getElementById('permanent-postal') as HTMLSelectElement).value);
  formData.append('currentPostal', (document.getElementById('current-postal') as HTMLSelectElement).value);

formData.append('permanentLandmark', (document.getElementById('permanet-landmark') as HTMLSelectElement).value);  
formData.append('aadharNumber', (document.getElementById('aadhar-number') as HTMLSelectElement).value);
  formData.append('panNumber', (document.getElementById('pan-number') as HTMLSelectElement).value);
  formData.append('pfAccount', (document.getElementById('pf-account') as HTMLSelectElement).value);
  
  formData.append('basic', (document.getElementById('basic') as HTMLSelectElement).value);
  formData.append('hra', (document.getElementById('hra') as HTMLSelectElement).value);
  formData.append('sa', (document.getElementById('sa') as HTMLSelectElement).value);//pt
  
  formData.append('pt', (document.getElementById('pt') as HTMLSelectElement).value);//tds
  formData.append('pfEc', (document.getElementById('pf-ec') as HTMLSelectElement).value);//notes
  formData.append('tds', (document.getElementById('tds') as HTMLSelectElement).value);

  formData.append('notes', (document.getElementById('notes') as HTMLSelectElement).value);

  formData.append('accountNumber', (document.getElementById('acno') as HTMLSelectElement).value);
  formData.append('bankName', (document.getElementById('bank-name') as HTMLSelectElement).value);
  formData.append('ifscCode', (document.getElementById('ifsc-code') as HTMLSelectElement).value);

  // Continue appending other fields similarly ...
    formData.append('previousCompany', (document.getElementById('previous-compnay') as HTMLInputElement).value);
    formData.append('previousPosition', (document.getElementById('previous-posstion') as HTMLInputElement).value);
    formData.append('previousSalary', (document.getElementById('previous-salary') as HTMLInputElement).value);
    formData.append('previousDOR', (document.getElementById('previous-dor') as HTMLInputElement).value);
    
    formData.append('salary', (document.getElementById('Salary') as HTMLInputElement).value);
    formData.append('deduction', (document.getElementById('deduction') as HTMLInputElement).value);
    formData.append('tax', (document.getElementById('tax') as HTMLInputElement).value);
    formData.append('currency', (document.getElementById('currency') as HTMLInputElement).value);

  // Files
  const aadharFile = (document.getElementById('aadhar-file') as HTMLInputElement)?.files?.[0];
  if (aadharFile) formData.append('aadharFile', aadharFile);

  const panFile = (document.getElementById('pan-file') as HTMLInputElement)?.files?.[0];
  if (panFile) formData.append('panFile', panFile);

  const logoFile = (document.getElementById('company-logo') as HTMLInputElement)?.files?.[0];
  if (logoFile) formData.append('companyLogo', logoFile);

  try {
    const method = id ? 'put' : 'post';
      const url = id
        ? `https://cybitbackend.onrender.com/api/employees/${id}`
        : 'https://cybitbackend.onrender.com/api/employees';
      const res=  await axios({ method, url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
    
    if (res.data) {
    //   alert('Employee saved!');
       
             setTimeout(() => {
       toast.success('Employee updated successfully');
                navigate('/apps/employee/list'); // yahan apna route de jahan redirect karna hai
      }, 1000);

      // Optionally reset form or navigate away
    }
  } catch (err) {
    console.error(err);
    alert('Error saving employee.');
  }
};


const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  

const handleChange = (e) => {
  const { id, value } = e.target; // id will be 'gender'
  setEmployee(prev => ({
    ...prev,
    [id]: value
  }));
};

  console.log('employee=',employee);

    return (
        <div className="flex xl:flex-row flex-col gap-2.5">
            {/* LEFT PANEL */}
            <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                {/* Invoice Info */}
                <div className="flex justify-between flex-wrap px-4">
                    <div className="mb-6 lg:w-1/2 w-full">
                        <div className="flex items-center text-black dark:text-white shrink-0">
                            {/* Current Logo or Preview */}
                            <img
                                src={logoPreview || "/assets/images/cybblackpink.png"}
                                alt="Company Logo"
                                className="w-14 h-14 object-cover rounded"
                            />

                            {/* Upload Input */}
                            <input
                                id="company-logo"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoChange}
                            />

                            {/* Styled Upload Button */}
                            <label
                                htmlFor="company-logo"
                                className="ml-4 cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                            >
                                Upload Logo
                            </label>
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
                            <label htmlFor="number" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Employee Number</label>
                            <input id="number" type="text" className="form-input lg:w-[250px] w-2/3" defaultValue={employee.employeeNumber} placeholder="#8801" />
                        </div>
                        {/* Invoice Label */}
                        <div className="flex items-center mt-4">
                            <label htmlFor="invoiceLabel" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Department</label>
                            <input id="invoiceLabel" type="text" className="form-input lg:w-[250px] w-2/3" defaultValue={employee.department} placeholder="Enter Department" />
                        </div>
                        <div className="flex items-center mt-4">
                            <label htmlFor="desingnation" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Designation</label>
                            <input id="desingnation" type="text" className="form-input lg:w-[250px] w-2/3" defaultValue={employee.designation} placeholder="Enter Designation" />
                        </div>
                        {/* Dates */}
                        <div className="flex items-center mt-4">
                            <label htmlFor="startDate" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Date Of Joining</label>
                            <input id="dateOfJoining" type="date" className="form-input lg:w-[250px] w-2/3" defaultValue={employee.dateOfJoining} />
                        </div>
                        
                    </div>
                </div>

                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />

                {/* Bill To & Payment Details */}
                  <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        {/* Bill To */}
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Personal Details</div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Name</label>
                                <input id="name" type="text" className="form-input flex-1" placeholder="Enter Name" defaultValue={employee.name} />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-email" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Email</label>
                                <input id="reciever-email" type="email" className="form-input flex-1" placeholder="Enter Email"  defaultValue={employee.email} />
                            </div>
                            <div className="mt-4 flex items-center">
                            <label htmlFor="password" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Password</label>
                            <input id="password-new" type="password" className="form-input flex-1" placeholder="Enter Password" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="confirm-password" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0"> Confirm Password </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    className="form-input flex-1"
                                    placeholder="Confirm Password"
                                />
                                </div>



                            <div className="mt-4 flex items-center">
                                <label htmlFor="mobile_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Mobile Number</label>
                                <input id="mobile_number" type="number" className="form-input flex-1" placeholder="Enter Mobile Number" defaultValue={employee.mobileNumber} />
                            </div>
                            

                            
                        </div>

                        {/* Payment Details */}
                        <div className="lg:w-1/2 w-full">
                        <br />
                        <div className="mt-4 flex items-center">
                                <label
                                    htmlFor="country"
                                    className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0"
                                >
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    value={employee.gender}
                                    onChange={handleChange}
                                    className="form-select flex-1 border rounded-md p-2"
                                >
                                    <option value="" disabled>
                                    Select Gender
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">FeMale</option>
                                </select>
                                </div>
                            <div className="text-lg"></div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="father-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Father's/Husband Name</label>
                                <input id="father-name" type="text" className="form-input flex-1" defaultValue={employee.fatherName || ''} placeholder="Enter Father's Name" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="mother_name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Mother's Name</label>
                                <input id="mother_name" type="text" className="form-input flex-1" defaultValue={employee.motherName || ''} placeholder="Enter Mother's Name" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="contact_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Contact Number</label>
                                <input id="contact_number" type="text" className="form-input flex-1" defaultValue={employee.contactNumber || ''} placeholder="Enter Contact Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label
                                    htmlFor="country"
                                    className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0"
                                >
                                    Marital Status
                                </label>
                                <select
                                    id="maritalStatus"             // id should match the key in employee object
                                    className="form-select flex-1 border rounded-md p-2"
                                    value={employee.maritalStatus}
                                    onChange={handleChange}
                                    >
                                    <option value="" disabled>Select Marital Status</option>
                                    <option value="Married">Married</option>
                                    <option value="Single">Single</option>
                                    </select>

                                </div>
                            
                        </div>
                    </div>
                </div>
                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                 <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        {/* Bill To */}
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Current Address Details</div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="aadhar_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">ADD Line 1</label>
                                <input id="current-address-line1" type="text" className="form-input flex-1" defaultValue={employee.currentAddressLine1 || ''} placeholder="Enter (House/Flat No., Street, Locality)" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pan_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">City / Town</label>
                                <input id="current-city" type="text" className="form-input flex-1" defaultValue={employee.currentCity} placeholder="Enter City / Town" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">District / County </label>
                                <input id="current-district" type="text" className="form-input flex-1" defaultValue={employee.currentDistrict} placeholder="Enter District / County" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">State / Province / Region</label>
                                <input id="current-state" type="text" className="form-input flex-1" defaultValue={employee.currentState} placeholder="Enter State / Province / Region" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="current-postal" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Postal Code / ZIP Code </label>
                                <input id="current-postal" type="text" className="form-input flex-1" defaultValue={employee.currentState} placeholder="Enter Postal Code / ZIP Code" />
                            </div>
                            
                           <div className="mt-4 flex items-center">
                            <label
                                htmlFor="country"
                                className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0"
                            >
                                Country
                            </label>
                            <select
                                id="currentCountry"
                                className="form-select flex-1 border rounded-md p-2"
                                 value={employee.currentCountry}
                                    onChange={handleChange}
                            >
                                <option value="" disabled>
                                Select Country
                                </option>
                                <option value="india">India</option>
                                <option value="usa">USA</option>
                                <option value="uk">UK</option>
                                <option value="canada">Canada</option>
                            </select>
                            </div>

                             <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Nearest Landmark </label>
                                <input id="current-landmark" type="text" className="form-input flex-1" defaultValue={employee.currentLandmark || ''} placeholder="Enter Nearest Landmark" />
                            </div>
                            
                        </div>

                        {/* Payment Details */}
                        <div className="lg:w-1/2 w-full">
                            <div className="text-lg">Permanent Address</div>
                              <div className="mt-4 flex items-center">
                                <label htmlFor="aadhar_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">ADD Line 1</label>
                                <input id="permanent-address-line1" type="text" className="form-input flex-1" defaultValue={employee.permanentAddressLine1 || ''} placeholder="Enter (House/Flat No., Street, Locality)" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pan_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">City / Town</label>
                                <input id="permanent-city" type="text" className="form-input flex-1" defaultValue={employee.permanentCity || ''} placeholder="Enter City / Town" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">District / County </label>
                                <input id="permanent-district" type="text" className="form-input flex-1" defaultValue={employee.permanentDistrict || ''} placeholder="Enter District / County" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">State / Province / Region</label>
                                <input id="permanent-state" type="text" className="form-input flex-1" defaultValue={employee.permanentState || ''} placeholder="Enter State / Province / Region" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Postal Code / ZIP Code </label>
                                <input id="permanent-postal" type="text" className="form-input flex-1" defaultValue={employee.permanentState || ''} placeholder="Enter Postal Code / ZIP Code" />
                            </div>
                           <div className="mt-4 flex items-center">
                            <label
                                htmlFor="permanent-country"
                                className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0"
                            >
                                Country
                            </label>
                            <select id="permanentCountry" className="form-select flex-1 border rounded-md p-2" value={employee.permanentCountry} onChange={handleChange} >
                                <option value="" disabled>
                                Select Country
                                </option>
                                <option value="india">India</option>
                                <option value="usa">USA</option>
                                <option value="uk">UK</option>
                                <option value="canada">Canada</option>
                            </select>
                            </div>

                            <div className="mt-4 flex items-center">
                                <label htmlFor="permanent-landmark" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Nearest Landmark </label>
                                <input id="permanet-landmark" type="text" className="form-input flex-1" placeholder="Enter Nearest Landmark"  defaultValue={employee.permanentLandmark} />
                            </div>

                        </div>
                    </div>
                </div>
                          <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        {/* Bill To */}
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Bank Details</div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="aadhar_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Aadhar Number</label>
                                <input id="aadhar-number" type="text" className="form-input flex-1" defaultValue={employee.aadharNumber || ''} placeholder="Enter Aadhar Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pan_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Pan Number</label>
                                <input id="pan-number" type="text" className="form-input flex-1" defaultValue={employee.panNumber || ''} placeholder="Enter Pan Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">PF A/C </label>
                                <input id="pf-account" type="text" className="form-input flex-1" defaultValue={employee.pfAccount || ''} placeholder="Enter PF A/C" />
                            </div>
                            
                        </div>

                        {/* Payment Details */}
                        <div className="lg:w-1/2 w-full">
                          <br />
                            <div className="text-lg"></div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="bank-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Bank Name</label>
                                <input id="bank-name" type="text" className="form-input flex-1" placeholder="Enter Bank Name" defaultValue={employee.bankName || ''} />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="acno" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Account Number</label>
                                <input id="acno" type="text" className="form-input flex-1" placeholder="Enter Account Number" defaultValue={employee.accountNumber || ''} />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="ifsc-code" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">IFSC Code</label>
                                <input id="ifsc-code" type="text" className="form-input flex-1" placeholder="Enter IFSC Code" defaultValue={employee.ifscCode || ''} />
                            </div>
                        </div>
                    </div>
                </div>
<hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        {/* Bill To */}
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Earnings</div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="aadhar_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Basic</label>
                                <input id="basic" type="text" className="form-input flex-1" placeholder="Enter Basic" defaultValue={employee.basic || ''} />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pan_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">H R A</label>
                                <input id="hra" type="text" className="form-input flex-1" placeholder="Enter House Rent Allowance" defaultValue={employee.hra || ''} />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">S A</label>
                                <input id="sa" type="text" className="form-input flex-1" placeholder="Enter Special Allowance" defaultValue={employee.sa || ''} />
                            </div>
                            
                        </div>

                        {/* Payment Details */}
                        <div className="lg:w-1/2 w-full">
                            <div className="text-lg">Deductions</div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="bank-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">P T</label>
                                <input id="pt" type="text" className="form-input flex-1" placeholder="Enter Profession Tax" defaultValue={employee.pt || ''} />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="acno" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">PF E C</label>
                                <input id="pf-ec" type="text" className="form-input flex-1" defaultValue={employee.pfEc || ''} placeholder="Enter PF Employee Contribution" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="ifsc-code" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">TDS</label>
                                <input id="tds" type="text" className="form-input flex-1" defaultValue={employee.tds || ''} placeholder="Enter TDS" />
                            </div>
                        </div>
                    </div>
                </div>
<hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        {/* Bill To */}
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Previous Compnay Details</div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="aadhar_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Previous Compnay</label>
                                <input id="previous-compnay" type="text" className="form-input flex-1" defaultValue={employee.previousCompany || ''} placeholder="Enter Previous Compnay" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="previous-posstion" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Possition</label>
                                <input id="previous-posstion" type="text" className="form-input flex-1" defaultValue={employee.previousPosition || ''} placeholder="Enter Position" />
                            </div>
                           
                           
                        </div>
                         <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                         <br />
                            <div className="text-lg"></div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Salary</label>
                                <input id="previous-salary" type="text" className="form-input flex-1" defaultValue={employee.previousSalary || ''} placeholder="Enter Salary" />
                            </div>
                             <div className="mt-4 flex items-center">
                                 <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">DOR</label>
                              <input
                                type="date"
                                id="previous-dor"
                                className="form-input flex-1"
                                defaultValue={employee.previousDOR ? employee.previousDOR.slice(0,10) : ''}
                              />

                            </div>
                           
                        </div>
                    </div>
                </div>
              <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
               

                {/* Notes */}
                <div className="mt-8 px-4">
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" className="form-textarea min-h-[130px]" defaultValue={employee.notes || ''} placeholder="Notes...."></textarea>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="xl:w-96 w-full xl:mt-0 mt-6">
                <div className="panel mb-5">
                    <label htmlFor="currency">Currency</label>
                    <select id="currency" name="currency" defaultValue={employee.currency || ''}
                        onChange={(e) => setSelectedCurrency(e.target.value)} className="form-select">
                        {currencyList.map((i) => (
                            <option key={i}>{i}</option>
                        ))}
                    </select>

                    <div className="mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="tax">Tax(%) </label>
                            <input id="tax" type="number" name="tax" defaultValue={employee.tax || ''} className="form-input"  />
                        </div>
                        <div>
                            <label htmlFor="discount">Deduction(%) </label>
                            <input id="deduction" type="number" name="deduction" defaultValue={employee.deduction|| ''} className="form-input"  />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="salary">Salary ({currencySymbols[selectedCurrency]}) </label>
                        <input id="Salary" type="number" name="Salary" className="form-input" defaultValue={employee.salary|| ''} />
                    </div>

                    {/* <div className="mt-4">
                        <label htmlFor="payment-method">Accept Payment Via</label>
                        <select id="payment-method" name="payment-method" className="form-select">
                            <option value="">Select Payment</option>
                            <option value="bank">Bank Account</option>
                            <option value="paypal">Paypal</option>
                            <option value="upi">UPI Transfer</option>
                        </select>
                    </div> */}
                </div>

                <div className="panel">
                    <div className="grid xl:grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
                        <button type="button" className="btn btn-success w-full gap-2" onClick={saveInvoice}>
                            <IconSave className="ltr:mr-2 rtl:ml-2 shrink-0" /> Save
                        </button>

                        {/* <button type="button" className="btn btn-info w-full gap-2">
                            <IconSend className="ltr:mr-2 rtl:ml-2 shrink-0" /> Send Invoice
                        </button> */}

                        {/* <Link to={id ? `/apps/employees/preview/${id}` : '/apps/employees/preview'} className="btn btn-primary w-full gap-2">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" /> Preview
                        </Link> */}

                        {/* <button type="button" className="btn btn-secondary w-full gap-2">
                            <IconDownload className="ltr:mr-2 rtl:ml-2 shrink-0" /> Download
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;
