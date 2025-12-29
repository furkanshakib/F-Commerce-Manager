import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ setIsLoggedIn }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth"); // Throw away the key
    setIsLoggedIn(false);
    navigate("/login"); // Go back to login screen
  };

  // ... (Invoice Logic remains the same) ...
  const generateInvoice = (order) => {
    const invoiceWindow = window.open('', '', 'width=800,height=600');
    const invoiceContent = `
      <html>
        <head>
          <title>Invoice #${order._id.slice(-4)}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600&display=swap');
            body { font-family: 'Hind Siliguri', sans-serif; padding: 40px; color: #333; }
            .invoice-box { border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #2563eb; }
            .info-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
            .info-table td { padding: 5px; vertical-align: top; }
            .label { font-weight: bold; width: 100px; }
            .product-box { border: 2px dashed #ccc; padding: 15px; background: #f9f9f9; margin-bottom: 20px; }
            .footer { text-align: center; font-size: 12px; margin-top: 30px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
            @media print {
              body { padding: 0; }
              .invoice-box { border: none; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <h1>F-Commerce Shop</h1>
              <p>Dhaka, Bangladesh | 01700-000000</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <table class="info-table">
              <tr>
                <td class="label">Date:</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td class="label">Invoice ID:</td>
                <td>#${order._id.slice(-6).toUpperCase()}</td>
              </tr>
              <tr>
                <td class="label">Customer:</td>
                <td><strong>${order.customerName}</strong></td>
              </tr>
              <tr>
                <td class="label">Phone:</td>
                <td>${order.phone}</td>
              </tr>
              <tr>
                <td class="label">Address:</td>
                <td>${order.address}</td>
              </tr>
            </table>
            <div class="product-box">
              <strong>📦 Products to Pack:</strong><br/>
              <p style="font-size: 18px; margin: 5px 0;">${order.products}</p>
            </div>
            <p><strong>Courier Service:</strong> ${order.courier}</p>
            <div style="text-align: center; margin-top: 40px;">
              <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; cursor: pointer; border-radius: 5px;">Print Receipt</button>
            </div>
            <div class="footer">Thank you for shopping with us! <br/>This is a computer-generated invoice.</div>
          </div>
        </body>
      </html>
    `;
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
  };

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🚀 Manager Dashboard</h2>
        <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div className="order-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span className="order-id">#{order._id.slice(-6)}</span>
              <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
            </div>
            <h3>{order.customerName}</h3>
            <p>📞 {order.phone}</p>
            <p>📍 {order.address}</p>
            <p>🛒 <strong>{order.products}</strong></p>
            <div className="actions">
                <button onClick={() => generateInvoice(order)} className="btn-invoice">Print Invoice</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;