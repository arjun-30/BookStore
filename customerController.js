const Customer = require('../models/Customer');
// Get all customers
exports.getCustomers = async (req, res) => {
 try {
 const customers = await Customer.find().sort({ name: 1 });
 res.json(customers);
 } catch (error) {
 console.error('Error fetching customers:', error);
 res.status(500).json({ message: 'Server error' });
 }
};
// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
 try {
 const customer = await Customer.findById(req.params.id);

 if (!customer) {
 return res.status(404).json({ message: 'Customer not found' });
 }

 res.json(customer);
 } catch (error) {
 console.error('Error fetching customer:', error);
 if (error.kind === 'ObjectId') {
 return res.status(404).json({ message: 'Customer not found' });
 }
 res.status(500).json({ message: 'Server error' });
 }
};
// Create a new customer
exports.createCustomer = async (req, res) => {
 try {
 const { name, email, phone, address } = req.body;

 // Check if customer with email already exists
 const existingCustomer = await Customer.findOne({ email });
 if (existingCustomer) {
 return res.status(400).json({ message: 'Customer with this email already exists' });
 }

 const newCustomer = new Customer({
 name,
 email,
 phone,
 address
 });

 const customer = await newCustomer.save();
 res.status(201).json(customer);
 } catch (error) {
 console.error('Error creating customer:', error);
 res.status(500).json({ message: 'Server error' });
 }
};
// Update a customer
exports.updateCustomer = async (req, res) => {
 try {
 const { name, email, phone, address } = req.body;

 // Check if customer exists
 let customer = await Customer.findById(req.params.id);
 if (!customer) {
 return res.status(404).json({ message: 'Customer not found' });
 }

 // Check if email is changing and if it's already in use
 if (email !== customer.email) {
 const existingCustomer = await Customer.findOne({ email });
 if (existingCustomer) {
 return res.status(400).json({ message: 'Customer with this email already exists' });
 }
 }

 // Update customer fields
 customer.name = name;
 customer.email = email;
 customer.phone = phone;
 customer.address = address;

 const updatedCustomer = await customer.save();
 res.json(updatedCustomer);
 } catch (error) {
 console.error('Error updating customer:', error);
 if (error.kind === 'ObjectId') {
 return res.status(404).json({ message: 'Customer not found' });
 }
 res.status(500).json({ message: 'Server error' });
 }
};
// Delete a customer
exports.deleteCustomer = async (req, res) => {
 try {
 const customer = await Customer.findById(req.params.id);

 if (!customer) {
 return res.status(404).json({ message: 'Customer not found' });
 }

 await customer.deleteOne();
 res.json({ message: 'Customer removed' });
 } catch (error) {
 console.error('Error deleting customer:', error);
 if (error.kind === 'ObjectId') {
 return res.status(404).json({ message: 'Customer not found' });
 }
 res.status(500).json({ message: 'Server error' });
 }
}