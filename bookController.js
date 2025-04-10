const Book = require('../models/Book');
// Get all books
exports.getBooks = async (req, res) => {
 try {
 const books = await Book.find().sort({ title: 1 });
 res.json(books);
 } catch (error) {
 console.error('Error fetching books:', error);
 res.status(500).json({ message: 'Server error' });
 }
};
// Get a single book by ID
exports.getBookById = async (req, res) => {
 try {
 const book = await Book.findById(req.params.id);

 if (!book) {
 return res.status(404).json({ message: 'Book not found' });
 }

 res.json(book);
 } catch (error) {
 console.error('Error fetching book:', error);
 if (error.kind === 'ObjectId') {
 return res.status(404).json({ message: 'Book not found' });
 }
 res.status(500).json({ message: 'Server error' });
 }
};
// Create a new book
exports.createBook = async (req, res) => {
 try {
 const {
 title,
 author,
 isbn,
 publisher,
 publishDate,
 description,
 price,
 stock,
 category
 } = req.body;

 // Check if book with ISBN already exists
 const existingBook = await Book.findOne({ isbn });
 if (existingBook) {
 return res.status(400).json({ message: 'Book with this ISBN already exists' });
 }

 const newBook = new Book({
 title,
 author,
 isbn,
 publisher,
 publishDate,
 description,
 price,
 stock,
 category
 });

 const book = await newBook.save();
 res.status(201).json(book);
 } catch (error) {
 console.error('Error creating book:', error);
 res.status(500).json({ message: 'Server error' });
 }
};
// Update a book
exports.updateBook = async (req, res) => {
 try {
 const {
 title,
 author,
 isbn,
 publisher,
 publishDate,
 description,
 price,
 stock,
 category
 } = req.body;

 // Check if book exists
 let book = await Book.findById(req.params.id);
 if (!book) {
 return res.status(404).json({ message: 'Book not found' });
 }

 // Check if ISBN is changing and if it's already in use
 if (isbn !== book.isbn) {
 const existingBook = await Book.findOne({ isbn });
 if (existingBook) {
 return res.status(400).json({ message: 'Book with this ISBN already exists' });
 }
 }

 // Update book fields
 book.title = title;
 book.author = author;
 book.isbn = isbn;
 book.publisher = publisher;
 book.publishDate = publishDate;
 book.description = description;
 book.price = price;
 book.stock = stock;
 book.category = category;

 const updatedBook = await book.save();
 res.json(updatedBook);
 } catch (error) {
 console.error('Error updating book:', error);
 if (error.kind === 'ObjectId') {
 return res.status(404).json({ message: 'Book not found' });
 }
 res.status(500).json({ message: 'Server error' });
 }
};
// Delete a book
exports.deleteBook = async (req, res) => {
 try {
 const book = await Book.findById(req.params.id);

 if (!book) {
 return res.status(404).json({ message: 'Book not found' });
 }

 await book.deleteOne();
 res.json({ message: 'Book removed' });
 } catch (error) {
 console.error('Error deleting book:', error);
 if (error.kind === 'ObjectId') {
 return res.status(404).json({ message: 'Book not found' });
 }
 res.status(500).json({ message: 'Server error' });
 }
};