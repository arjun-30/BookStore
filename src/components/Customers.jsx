import React, { useState, useEffect } from 'react';
import axios from 'axios';
const Customers = () => {
 const [customers, setCustomers] = useState([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
 const [customersPerPage] = useState(10);

 const [showForm, setShowForm] = useState(false);
 const [editingCustomer, setEditingCustomer] = useState(null);
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 phone: '',
 address: ''
 });
 const [formError, setFormError] = useState('');
 const [formSuccess, setFormSuccess] = useState('');
 useEffect(() => {
 fetchCustomers();
 }, []);
 const fetchCustomers = async () => {
 try {
 setLoading(true);
 const response = await axios.get('/api/customers');
 setCustomers(response.data);
 setLoading(false);
 } catch (error) {
 console.error('Error fetching customers:', error);
 setLoading(false);
 }
 };
 const handleChange = (e) => {
 const { name, value } = e.target;
 setFormData(prev => ({
 ...prev,
 [name]: value
 }));
 };
 const handleDelete = async (id) => {
 if (window.confirm('Are you sure you want to delete this customer?')) {
 try {
 await axios.delete(`/api/customers/${id}`);
 fetchCustomers();
 } catch (error) {
 console.error('Error deleting customer:', error);
 }
 }
 };
 const handleEdit = (customer) => {
 setEditingCustomer(customer._id);
 setFormData({
 name: customer.name,
 email: customer.email,
 phone: customer.phone || '',
 address: customer.address || ''
 });
 setShowForm(true);
 window.scrollTo(0, 0);
 };
 const handleSubmit = async (e) => {
 e.preventDefault();
 setFormError('');
 setFormSuccess('');

 try {
 if (editingCustomer) {
 // Update existing customer
 await axios.put(`/api/customers/${editingCustomer}`, formData);
 setFormSuccess('Customer updated successfully!');
 } else {
 // Create new customer
 await axios.post('/api/customers', formData);
 setFormSuccess('Customer added successfully!');
 }

 // Reset form
 setFormData({
 name: '',
 email: '',
 phone: '',
 address: ''
 });

 setEditingCustomer(null);
 fetchCustomers(); // Refresh data

 // Hide form after success
 setTimeout(() => {
 setShowForm(false);
 setFormSuccess('');
 }, 1500);

 } catch (error) {
 console.error('Error saving customer:', error);
 setFormError('Failed to save customer. Please try again.');
 }
 };
 const handleSearch = (e) => {
 setSearchTerm(e.target.value);
 setCurrentPage(1);
 };
 // Filter customers based on search term
 const filteredCustomers = customers.filter(customer =>
 customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
 (customer.phone && customer.phone.includes(searchTerm))
 );
 // Pagination
 const indexOfLastCustomer = currentPage * customersPerPage;
 const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
 const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
 const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
 return (
 <div className="customers">
 <div className="section-header">
 <h2>Customer Management</h2>
 <button
 className="btn btn-primary"
 onClick={() => {
 setShowForm(!showForm);
 setEditingCustomer(null);
 setFormData({
 name: '',
 email: '',
 phone: '',
 address: ''
 });
 setFormError('');
 setFormSuccess('');
 }}
 >
 {showForm && !editingCustomer ? 'Cancel' : 'Add New Customer'}
 </button>
 </div>

 {showForm && (
 <div className="customer-form">
 <h3>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>

 {formError && <div className="alert alert-danger">{formError}</div>}
 {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

 <form onSubmit={handleSubmit}>
 <div className="form-row">
 <div className="form-group">
 <label htmlFor="name">Name</label>
 <input
 type="text"
 id="name"
 name="name"
 value={formData.name}
 onChange={handleChange}
 required
 />
 </div>

 <div className="form-group">
 <label htmlFor="email">Email</label>
 <input
 type="email"
 id="email"
 name="email"
 value={formData.email}
 onChange={handleChange}
 required
 />
 </div>
 </div>

 <div className="form-row">
 <div className="form-group">
 <label htmlFor="phone">Phone</label>
 <input
 type="text"
 id="phone"
 name="phone"
 value={formData.phone}
 onChange={handleChange}
 />
 </div>

 <div className="form-group">
 <label htmlFor="address">Address</label>
 <input
 type="text"
 id="address"
 name="address"
 value={formData.address}
 onChange={handleChange}
 />
 </div>
 </div>

 <div className="form-buttons">
 <button type="submit" className="btn btn-primary">
 {editingCustomer ? 'Update Customer' : 'Add Customer'}
 </button>
 {editingCustomer && (
 <button
 type="button"
 className="btn"
 onClick={() => {
 setEditingCustomer(null);
 setFormData({
 name: '',
 email: '',
 phone: '',
 address: ''
 });
 }}
 >
 Cancel Edit
 </button>
 )}
 </div>
 </form>
 </div>
 )}

 <div className="search-bar">
 <input
 type="text"
 placeholder="Search by name, email, or phone..."
 value={searchTerm}
 onChange={handleSearch}
 />
 </div>

 {loading ? (
 <p>Loading...</p>
 ) : (
 <>
 <table>
 <thead>
 <tr>
 <th>Name</th>
 <th>Email</th>
 <th>Phone</th>
 <th>Address</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody>
 {currentCustomers.map(customer => (
 <tr key={customer._id}>
 <td>{customer.name}</td>
 <td>{customer.email}</td>
 <td>{customer.phone || '-'}</td>
 <td>{customer.address || '-'}</td>
 <td className="action-buttons">
 <button
 className="edit"
 onClick={() => handleEdit(customer)}
 >
 <i className="fas fa-edit"></i>
 </button>
 <button
 className="delete"
 onClick={() => handleDelete(customer._id)}
 >
 <i className="fas fa-trash"></i>
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>

 {/* Pagination */}
 {totalPages > 1 && (
 <div className="pagination">
 <button
 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
 disabled={currentPage === 1}
 >
 &laquo; Prev
 </button>

 {[...Array(totalPages)].map((_, index) => (
 <button
 key={index}
 className={currentPage === index + 1 ? 'active' : ''}
 onClick={() => setCurrentPage(index + 1)}
 >
 {index + 1}
 </button>
 ))}

 <button
 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
 disabled={currentPage === totalPages}
 >
 Next &raquo;
 </button>
 </div>
 )}
 </>
 )}
 </div>
 );
};
export default Customers;