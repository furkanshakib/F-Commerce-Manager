import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ setIsLoggedIn }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // USE YOUR RENDER LINK HERE
  const API_URL = 'https://f-commerce-api.onrender.com/api/orders'; 

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_URL);
      // Sort newest first
      const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      fetchOrders(); // Refresh to move the card to the new category
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsLoggedIn(false);
    navigate("/login");
  };

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
            @media print { .no-print { display: none; } .invoice-box { border: none; } }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header"><h1>F-Commerce Shop</h1><p>Dhaka, Bangladesh</p></div>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <table class="info-table">
              <tr><td class="label">Date:</td><td>${new Date(order.date).toLocaleDateString()}</td></tr>
              <tr><td class="label">Invoice ID:</td><td>#${order._id.slice(-6).toUpperCase()}</td></tr>
              <tr><td class="label">Customer:</td><td><strong>${order.customerName}</strong></td></tr>
              <tr><td class="label">Phone:</td><td>${order.phone}</td></tr>
              <tr><td class="label">Address:</td><td>${order.address}</td></tr>
            </table>
            <div class="product-box"><strong>📦 Products:</strong><br/>${order.products}</div>
            <div style="text-align: center; margin-top: 40px;"><button class="no-print" onclick="window.print()">Print Receipt</button></div>
          </div>
        </body>
      </html>
    `;
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
  };

  // --- FILTERS ---
  // If status is "Pending" OR if it has no status (old orders), put it in Pending
  const pendingOrders = orders.filter(o => o.status === "Pending" || !o.status);
  const deliveredOrders = orders.filter(o => o.status === "Delivered");
  const receivedOrders = orders.filter(o => o.status === "Received");

  // Reusable Card Component to save space
  const OrderCard = ({ order }) => (
    <div className="order-card" style={{ borderLeft: `5px solid ${order.status === 'Delivered' ? '#2563eb' : order.status === 'Received' ? '#16a34a' : '#ca8a04'}` }}>
      <div className="order-header">
        <span className="order-id">#{order._id.slice(-6)}</span>
        <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
      </div>
      <h3>{order.customerName}</h3>
      <p>📞 {order.phone}</p>
      <p>📍 {order.address}</p>
      <p>🛒 <strong>{order.products}</strong></p>
      
      <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        {order.status !== "Delivered" && order.status !== "Received" && (
            <button onClick={() => updateStatus(order._id, "Delivered")} style={{ flex: 1, padding: '8px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Sent to Courier 🚚</button>
        )}
        {order.status !== "Received" && (
          <button onClick={() => updateStatus(order._id, "Received")} style={{ flex: 1, padding: '8px', background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Complete ✅</button>
        )}
      </div>
      <button onClick={() => generateInvoice(order)} className="btn-invoice" style={{ marginTop: '10px' }}>Print Invoice</button>
    </div>
  );

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>🚀 Manager Dashboard</h2>
        <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </div>

      {/* SECTION 1: PENDING */}
      <h3 style={{ color: '#ca8a04', borderBottom: '2px solid #ca8a04', paddingBottom: '5px' }}>🟡 Pending Orders ({pendingOrders.length})</h3>
      <div className="order-list" style={{ marginBottom: '40px' }}>
        {pendingOrders.length > 0 ? pendingOrders.map(order => <OrderCard key={order._id} order={order} />) : <p>No pending orders.</p>}
      </div>

      {/* SECTION 2: ON DELIVERY */}
      <h3 style={{ color: '#2563eb', borderBottom: '2px solid #2563eb', paddingBottom: '5px' }}>🚚 On Delivery ({deliveredOrders.length})</h3>
      <div className="order-list" style={{ marginBottom: '40px' }}>
        {deliveredOrders.length > 0 ? deliveredOrders.map(order => <OrderCard key={order._id} order={order} />) : <p>No orders in transit.</p>}
      </div>

      {/* SECTION 3: COMPLETED */}
      <h3 style={{ color: '#16a34a', borderBottom: '2px solid #16a34a', paddingBottom: '5px' }}>✅ Completed History ({receivedOrders.length})</h3>
      <div className="order-list">
        {receivedOrders.length > 0 ? receivedOrders.map(order => <OrderCard key={order._id} order={order} />) : <p>No completed orders yet.</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;