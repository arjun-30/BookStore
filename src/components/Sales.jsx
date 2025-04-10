import React, { useState, useEffect } from 'react';
import axios from 'axios';
const Sales = () => {
 const [sales, setSales] = useState([]);
 const [books, setBooks] = useState([]);
 const [customers, setCustomers] = useState([]);
 const [loading, setLoading] = useState(true);
 const [currentPage, setCurrentPage] = useState(1);
 const [salesPerPage] = useState(10);

 const [showForm, setShowForm] = useState(false);
 const [formData, setFormData] = useState({
 book: '',
 customer: '',
 quantity: 1,
 date: new Date().toISOString().split('T')[0]
 });
 const [formError, setFormError] = useState('');
 const [formSuccess, setFormSuccess] = useState('');
 useEffect(() => {
 fetchData();
 }, []);
 const fetchData = async () => {
 try {
 setLoading(true);

 // Fetch sales, books, and customers in parallel
 const [salesRes, booksRes, customersRes] = await Promise.all([
 axios.get('/api/sales'),
 axios.get('/api/books'),
 axios.get('/api/customers')
 ]);

 setSales(salesRes.data);
 setBooks(booksRes.data);
 setCustomers(customersRes.data);

 setLoading(false);
 } catch (error) {
 console.error('Error fetching data:', error);
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
 const handleSubmit = async (e) => {
 e.preventDefault();
 setFormError('');
 setFormSuccess('');

 try {
 // Create new sale
 await axios.post('/api/sales', formData);

 // Reset form
 setFormData({
 book: '',
 customer: '',
 quantity: 1,
 date: new Date().toISOString().split('T')[0]
 });

 setFormSuccess('Sale recorded successfully!');
 fetchData(); // Refresh data

 // Hide form after success
 setTimeout(() => {
 setShowForm(false);
 setFormSuccess('');
 }, 1500);

 } catch (error) {
 console.error('Error recording sale:', error);
 setFormError('Failed to record sale. Please try again.');
 }
 };
 // Format date
 const formatDate = (dateString) => {
 const options = { year: 'numeric', month: 'short', day: 'numeric' };
 return new Date(dateString).toLocaleDateString(undefined, options);
 };
 // Get book and customer details
 const getBookTitle = (bookId) => {
 const book = books.find(b => b._id === bookId);
 return book ? book.title : 'Unknown Book';
 };
 const getCustomerName = (customerId) => {
 const customer = customers.find(c => c._id === customerId);
 return customer ? customer.name : 'Unknown Customer';
 };
 // Pagination
 const indexOfLastSale = currentPage * salesPerPage;
 const indexOfFirstSale = indexOfLastSale - salesPerPage;
 const currentSales = sales.slice(indexOfFirstSale, indexOfLastSale);
 const totalPages = Math.ceil(sales.length / salesPerPage);
 return (
 <div className="sales">
 <div className="section-header">
 <h2>Sales Records</h2>
 <button
 className="btn btn-primary"
 onClick={() => setShowForm(!showForm)}
 >
 // Continue from previous code in src/components/Sales.jsx
 {showForm ? 'Cancel' : 'Record New Sale'}
 </button>
 </div>

 {showForm && (
 <div className="sale-form">
 <h3>Record New Sale</h3>

 {formError && <div className="alert alert-danger">{formError}</div>}
 {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

 <form onSubmit={handleSubmit}>
 <div className="form-row">
 <div className="form-group">
 <label htmlFor="book">Book</label>
 <select
 id="book"
 name="book"
 value={formData.book}
 onChange={handleChange}
 required
 >
 <option value="">Select Book</option>
 {books.map(book => (
 <option key={book._id} value={book._id} disabled={book.stock < 1}>
 {book.title} - ${book.price.toFixed(2)} {book.stock < 1 ? '(Out of Stock)' : ''}
 </option>
 ))}
 </select>
 </div>

 <div className="form-group">
 <label htmlFor="customer">Customer</label>
 <select
 id="customer"
 name="customer"
 value={formData.customer}
 onChange={handleChange}
 required
 >
 <option value="">Select Customer</option>
 {customers.map(customer => (
 <option key={customer._id} value={customer._id}>
 {customer.name}
 </option>
 ))}
 </select>
 </div>
 </div>

 <div className="form-row">
 <div className="form-group">
 <label htmlFor="quantity">Quantity</label>
 <input
 type="number"
 id="quantity"
 name="quantity"
 min="1"
 step="1"
 value={formData.quantity}
 onChange={handleChange}
 required
 />
 </div>

 <div className="form-group">
 <label htmlFor="date">Date</label>
 <input
 type="date"
 id="date"
 name="date"
 value={formData.date}
 onChange={handleChange}
 required
 />
 </div>
 </div>

 <button type="submit" className="btn btn-primary">
 Record Sale
 </button>
 </form>
 </div>
 )}

 {loading ? (
 <p>Loading...</p>
 ) : (
 <>
 <table>
 <thead>
 <tr>
 <th>Date</th>
 <th>Book</th>
 <th>Customer</th>
 <th>Quantity</th>
 <th>Amount</th>
 </tr>
 </thead>
 <tbody>
 {currentSales.map(sale => (
 <tr key={sale._id}>
 <td>{formatDate(sale.date)}</td>
 <td>{getBookTitle(sale.book)}</td>
 <td>{getCustomerName(sale.customer)}</td>
 <td>{sale.quantity}</td>
 <td>${sale.amount.toFixed(2)}</td>
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
export default Sales;