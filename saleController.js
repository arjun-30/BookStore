const Sale = require('../models/Sale');
const Book = require('../models/Book');
const Customer = require('../models/Customer');
// Get all sales
exports.getSales = async (req, res) => {
 try {
 const sales = await Sale.find().sort({ date: -1 });
 res.json(sales);
 } catch (error) {
 console.error('Error fetching sales:', error);
 res.status(500).json({ message: 'Server error' });
 }
};
// Get a single sale by ID
exports.getSaleById = async (req, res) => {
 try {
 const sale = await Sale.findById(req.params.id);

 if (!sale) {
 return res.status(404).json({ message: 'Sale not found' });
 }

 res.json(sale);
 } catch (error) {
 console.error('Error fetching sale:', error);
 if (error.kind === 'ObjectId') {
 return res.status(404).json({ message: 'Sale not found' });
 }
 res.status(500).json({ message: 'Server error' });
 }
};
// Create a new sale
exports.createSale = async (req, res) => {
 try {
 const { book: bookId, customer: customerId, quantity, date } = req.body;

 // Verify book exists and has enough stock
 const book = await Book.findById(bookId);
 if (!book) {
 return res.status(404).json({ message: 'Book not found' });
 }

 if (book.stock < quantity) {
 return res.status(400).json({
 message: `Not enough stock. Available: ${book.stock}, Requested: ${quantity}`
 });
 }

 // Verify customer exists
 const customer = await Customer.findById(customerId);
 if (!customer) {
 return res.status(404).json({ message: 'Customer not found' });
 }

 // Calculate sale amount
 const amount = book.price * quantity;

 // Create new sale
 const newSale = new Sale({
 book: bookId,
 customer: customerId,
 quantity,
 amount,
 date: date || Date.now()
 });

 // Update book stock
 book.stock -= quantity;
 await book.save();

 // Save sale
 const sale = await newSale.save();
 res.status(201).json(sale);
 } catch (error) {
 console.error('Error creating sale:', error);
 res.status(500).json({ message: 'Server error' });
 }
};
// Update a sale
exports.updateSale = async (req, res) => {
 try {
 const { book: bookId, customer: customerId, quantity, date } = req.body;

 // Find the sale
 const sale = await Sale.findById(req.params.id);
 if (!sale) {
 return res.status(404).json({ message: 'Sale not found' });
 }

 // If book is changing or quantity is changing, handle stock changes
 if (bookId !== sale.book.toString() || quantity !== sale.quantity) {
 // Return original stock to the original book
 const originalBook = await Book.findById(sale.book);
 if (originalBook) {
 originalBook.stock += sale.quantity;
 await originalBook.save();
 }

 // Verify new book exists and has enough stock
 const newBook = await Book.findById(bookId);
 if (!newBook) {
 return res.status(404).json({ message: 'Book not found' });
 }

 if (newBook.stock < quantity) {
 return res.status(400).json({
 message: `Not enough stock. Available: ${newBook.stock}, Requested: ${quantity}`
 });
 }

 // Update new book stock
 newBook.stock -= quantity;
 await newBook.save();

 // Calculate new amount
 sale.amount = newBook.price * quantity;
 }

 // Verify customer exists
 if (customerId) {
 const customer = await Customer.findById(customerId);
 if (!customer) {
 return res.status(404).json({ message: 'Customer not found' });
 }
 }

 // Update sale fields
 sale.book = bookId || sale.book;
 sale.customer = customerId || sale.customer;
 sale.quantity = quantity || sale.quantity;
 sale.date = date || sale.date;

 const updatedSale = await sale.save();
 res.json(updatedSale);
 } catch (error) {
 console.error('Error updating sale:', error);
 if (error.kind === 'ObjectId') {
 return res.status(404).json({ message: 'Sale not found' });
 }
 res.status(500).json({ message: 'Server error' });
 }
};
// Delete a sale
exports.deleteSale = async (req, res) => {
 try {
 const sale = await Sale.findById(req.params.id);

 if (!sale) {
 return res.status(404).json({ message: 'Sale not found' });
 }

 // Return stock to book
 const book = await Book.findById(sale.book);
 if (book) {
 book.stock += sale.quantity;
 await book.save();
 }

 await sale.deleteOne();
 res.json({ message: 'Sale removed' });
 } catch (error) {
 console.error('Error deleting sale:', error);
 if (error.kind === 'ObjectId') {
 return res.status(404).json({ message: 'Sale not found' });
 }
 res.status(500).json({ message: 'Server error' });
 }
};