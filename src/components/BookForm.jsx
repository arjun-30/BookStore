import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const BookForm = () => {
 const { id } = useParams();
 const navigate = useNavigate();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');

 const [formData, setFormData] = useState({
 title: '',
 author: '',
 isbn: '',
 publisher: '',
 publishDate: '',
 description: '',
 price: '',
 stock: '',
 category: ''
 });
 useEffect(() => {
 if (id) {
 fetchBook();
 }
 }, [id]);
 const fetchBook = async () => {
 try {
 setLoading(true);
 const response = await axios.get(`/api/books/${id}`);
 const book = response.data;

 // Format date for input field (YYYY-MM-DD)
 const formattedDate = book.publishDate ?
 new Date(book.publishDate).toISOString().split('T')[0] : '';

 setFormData({
 title: book.title,
 author: book.author,
 isbn: book.isbn,
 publisher: book.publisher,
 publishDate: formattedDate,
 description: book.description,
 price: book.price,
 stock: book.stock,
 category: book.category
 });

 setLoading(false);
 } catch (error) {
 console.error('Error fetching book:', error);
 setError('Failed to fetch book details');
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
 setLoading(true);
 setError('');
 setSuccess('');

 try {
 if (id) {
 // Update existing book
 await axios.put(`/api/books/${id}`, formData);
 setSuccess('Book updated successfully!');
 } else {
 // Add new book
 await axios.post('/api/books', formData);
 setSuccess('Book added successfully!');
 setFormData({
 title: '',
 author: '',
 isbn: '',
 publisher: '',
 publishDate: '',
 description: '',
 price: '',
 stock: '',
 category: ''
 });
 }

 setTimeout(() => {
 navigate('/inventory');
 }, 1500);

 } catch (error) {
 console.error('Error saving book:', error);
 setError('Failed to save book. Please try again.');
 } finally {
 setLoading(false);
 }
 };
 return (
 <div className="book-form">
 <h2>{id ? 'Edit Book' : 'Add New Book'}</h2>

 {error && <div className="alert alert-danger">{error}</div>}
 {success && <div className="alert alert-success">{success}</div>}

 <form onSubmit={handleSubmit}>
 <div className="form-row">
 <div className="form-group">
 <label htmlFor="title">Title</label>
 <input
 type="text"
 id="title"
 name="title"
 value={formData.title}
 onChange={handleChange}
 required
 />
 </div>

 <div className="form-group">
 <label htmlFor="author">Author</label>
 <input
 type="text"
 id="author"
 name="author"
 value={formData.author}
 onChange={handleChange}
 required
 />
 </div>
 </div>

 <div className="form-row">
 <div className="form-group">
 <label htmlFor="isbn">ISBN</label>
 <input
 type="text"
 id="isbn"
 name="isbn"
 value={formData.isbn}
 onChange={handleChange}
 required
 />
 </div>

 <div className="form-group">
 <label htmlFor="category">Category</label>
 <select
 id="category"
 name="category"
 value={formData.category}
 onChange={handleChange}
 required
 >
 <option value="">Select Category</option>
 <option value="Fiction">Fiction</option>
 <option value="Non-Fiction">Non-Fiction</option>
 <option value="Mystery">Mystery</option>
 <option value="Sci-Fi">Sci-Fi</option>
 <option value="Biography">Biography</option>
 <option value="Self-Help">Self-Help</option>
 <option value="Business">Business</option>
 <option value="Children">Children</option>
 <option value="Technology">Technology</option>
 <option value="Other">Other</option>
 </select>
 </div>
 </div>

 <div className="form-row">
 <div className="form-group">
 <label htmlFor="publisher">Publisher</label>
 <input
 type="text"
 id="publisher"
 name="publisher"
 value={formData.publisher}
 onChange={handleChange}
 />
 </div>

 <div className="form-group">
 <label htmlFor="publishDate">Publish Date</label>
 <input
 type="date"
 id="publishDate"
 name="publishDate"
 value={formData.publishDate}
 onChange={handleChange}
 />
 </div>
 </div>

 <div className="form-row">
 <div className="form-group">
 <label htmlFor="price">Price ($)</label>
 <input
 type="number"
 id="price"
 name="price"
 step="0.01"
 min="0"
 value={formData.price}
 onChange={handleChange}
 required
 />
 </div>

 <div className="form-group">
 <label htmlFor="stock">Stock</label>
 <input
 type="number"
 id="stock"
 name="stock"
 min="0"
 value={formData.stock}
 onChange={handleChange}
 required
 />
 </div>
 </div>

 <div className="form-group">
 <label htmlFor="description">Description</label>
 <textarea
 id="description"
 name="description"
 rows="4"
 value={formData.description}
 onChange={handleChange}
 ></textarea>
 </div>

 <div className="form-buttons">
 <button
 type="button"
 className="btn"
 onClick={() => navigate('/inventory')}
 >
 Cancel
 </button>
 <button
 type="submit"
 className="btn btn-primary"
 disabled={loading}
 >
 {loading ? 'Saving...' : id ? 'Update Book' : 'Add Book'}
 </button>
 </div>
 </form>
 </div>
 );
};
export default BookForm;
