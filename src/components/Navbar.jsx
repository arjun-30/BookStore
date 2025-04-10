import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <h1>Bookstore<br />Management</h1>
      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <i className="fas fa-chart-line"></i> Dashboard
          </Link>
        </li>
        <li className={location.pathname.startsWith('/inventory') ? 'active' : ''}>
          <Link to="/inventory">
            <i className="fas fa-book"></i> Inventory
          </Link>
        </li>
        <li className={location.pathname === '/sales' ? 'active' : ''}>
          <Link to="/sales">
            <i className="fas fa-shopping-cart"></i> Sales
          </Link>
        </li>
        <li className={location.pathname === '/customers' ? 'active' : ''}>
          <Link to="/customers">
            <i className="fas fa-users"></i> Customers
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
