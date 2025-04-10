// TODO: Fill in from PDF content
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const bookRoutes = require('./routes/bookRoutes');
const customerRoutes = require('./routes/customerRoutes');
const saleRoutes = require('./routes/saleRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', saleRoutes);

// Dashboard Stats Route
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const Book = require('./models/Book');
    const Sale = require('./models/Sale');
    const Customer = require('./models/Customer');

    const totalBooks = await Book.countDocuments();
    const totalSales = await Sale.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const sales = await Sale.find();
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);

    res.json({ totalBooks, totalSales, totalRevenue, totalCustomers });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
