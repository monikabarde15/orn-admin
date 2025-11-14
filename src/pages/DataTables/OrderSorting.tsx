import { useEffect, useState } from 'react';
import axios from 'axios';

interface Employee {
  _id: string;
  name: string;
  email: string;
  employeeNumber: string;
  role: string;
  permissions: string[];
}

const OrderSorting = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [role, setRole] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://cybitbackend.onrender.com/api/employees');
      setEmployees(res.data.data);
    } catch (e) {
      console.error('Failed to fetch employees', e);
    }
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setRole(employee.role);
    setPermissions(employee.permissions || []);
    setError('');
  };

  const handleSubmit = async () => {
    if (!role) {
      setError('Role is required');
      return;
    }
    try {
     await axios.put(`https://cybitbackend.onrender.com/api/employees/${selectedEmployee?._id}/permissionsnew`, 
  { role, permissions },
  { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
);


      alert('Permissions updated successfully');
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (e) {
      setError('Failed to update permissions');
      console.error(e);
    }
  };

  const availableRoles = ['employee'];
  const availablePermissions=['todolist', 'analytics', 'finance','crypto','notes','Blogs','scrumboard','contacts','invoice/list','invoice/add','expenses/list','expenses/add','Estimation/list','Estimation/add','calendar'];
  // const availablePermissions = ['read', 'write', 'delete'];

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', maxWidth: 900, margin: 'auto' }}>
      <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Employees List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Employee No.</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Role</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Permissions</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{emp.employeeNumber}</td>
              <td style={{ padding: '10px' }}>{emp.name}</td>
              <td style={{ padding: '10px' }}>{emp.email}</td>
              <td style={{ padding: '10px', textTransform: 'capitalize' }}>{emp.role}</td>
              <td style={{ padding: '10px' }}>{emp.permissions?.join(', ')}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button
                  onClick={() => handleEditClick(emp)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#777' }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedEmployee && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          onClick={() => setSelectedEmployee(null)} // close modal on background click
        >
          <div
            onClick={e => e.stopPropagation()} // prevent modal close on clicking inside modal content
            style={{
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              padding: '20px',
              width: '400px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>
              Edit Permissions for {selectedEmployee.name}
            </h3>

            {error && (
              <div
                style={{
                  color: 'red',
                  marginBottom: '12px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="role-select"
                style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}
              >
                Role
              </label>
              <select
                id="role-select"
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              >
                <option value="">Select role</option>
                {availableRoles.map(r => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <fieldset
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '20px',
              }}
            >
              <legend style={{ fontWeight: '600', marginBottom: '10px' }}>Permissions</legend>
              <small style={{ display: 'block', marginBottom: '15px', color: '#555' }}>
                Select the permissions this employee should have.
              </small>
              {availablePermissions.map(p => (
                <label
                  key={p}
                  style={{
                    display: 'block',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    userSelect: 'none',
                    fontSize: '1rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(p)}
                    onChange={e => {
                      if (e.target.checked) {
                        setPermissions([...permissions, p]);
                      } else {
                        setPermissions(permissions.filter(x => x !== p));
                      }
                    }}
                    style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                  />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </label>
              ))}
            </fieldset>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleSubmit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  marginRight: '10px',
                  fontWeight: '600',
                }}
              >
                Save
              </button>
              <button
                onClick={() => setSelectedEmployee(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSorting;
