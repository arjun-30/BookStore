import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const statsRes = await axios.get('/api/dashboard/stats');
      setStats(statsRes.data);

      const salesRes = await axios.get('/api/sales/recent');
      setRecentSales(salesRes.data);

      const stockRes = await axios.get('/api/books/low-stock');
      setLowStock(stockRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card"><h3>Total Books</h3><p>{stats.totalBooks}</p></div>
        <div className="stat-card"><h3>Total Sales</h3><p>{stats.totalSales}</p></div>
        <div className="stat-card"><h3>Total Revenue</h3><p>${stats.totalRevenue.toFixed(2)}</p></div>
        <div className="stat-card"><h3>Total Customers</h3><p>{stats.totalCustomers}</p></div>
      </div>

      <div className="dashboard-tables">
        <div className="recent-sales">
          <h3>Recent Sales</h3>
          <table>
            <thead><tr><th>Date</th><th>Book</th><th>Customer</th><th>Amount</th></tr></thead>
            <tbody>
              {recentSales.map(sale => (
                <tr key={sale._id}>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                  <td>{sale.book.title}</td>
                  <td>{sale.customer.name}</td>
                  <td>${sale.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="low-stock">
          <h3>Low Stock Alert</h3>
          <table>
            <thead><tr><th>Book</th><th>Author</th><th>Stock</th></tr></thead>
            <tbody>
              {lowStock.map(book => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
