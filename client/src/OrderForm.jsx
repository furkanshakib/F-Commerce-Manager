import React, { useState } from 'react';
import axios from 'axios';

function OrderForm() {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    products: '',
    courier: 'Pathao'
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to our backend
      await axios.post('http://localhost:5000/api/orders', formData);
      alert('Order Placed Successfully! We will call you soon.');
      setFormData({ customerName: '', phone: '', address: '', products: '', courier: 'Pathao' }); // Reset form
    } catch (error) {
      console.error(error);
      alert('Error placing order. Please try again.');
    }
  };

  return (
    <div className="card">
      <h2>📦 Place Your Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name</label>
          <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="Enter your name" />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="017..." />
        </div>

        <div className="form-group">
          <label>Full Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} required placeholder="House, Road, Area, District" />
        </div>

        <div className="form-group">
          <label>Products (e.g., 2x T-Shirt)</label>
          <input type="text" name="products" value={formData.products} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Preferred Courier</label>
          <select name="courier" value={formData.courier} onChange={handleChange}>
            <option value="Pathao">Pathao</option>
            <option value="Steadfast">Steadfast</option>
            <option value="Sundarban">Sundarban Courier</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">Confirm Order</button>
      </form>
    </div>
  );
}

export default OrderForm;