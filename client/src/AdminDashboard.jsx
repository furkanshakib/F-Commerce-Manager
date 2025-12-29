import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ setIsLoggedIn }) {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const navigate = useNavigate();

  // USE YOUR RENDER LINK HERE
  const API_URL = 'https://f-commerce-api.onrender.com/api/orders'; 

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_URL);
      const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      fetchOrders(); 
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

  // --- FILTER LOGIC ---
  const pendingOrders = orders.filter(o => o.status === "Pending" || !o.status);
  const deliveredOrders = orders.filter(o => o.status === "Delivered");
  const receivedOrders = orders.filter(o => o.status === "Received");

  const currentList = activeTab === "Pending" ? pendingOrders 
                    : activeTab === "Delivered" ? deliveredOrders 
                    : receivedOrders;

  // --- UPDATED TAB STYLES ---
  const tabStyle = (name, color) => ({
    padding: '12px 20px',
    border: '2px solid white', // <--- THE WHITE BORDER
    borderRadius: '10px',      // <--- Rounded corners
    marginRight: '10px',       // <--- Space between tabs
    background: activeTab === name ? 'white' : 'transparent', // White background when active
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    color: activeTab === name ? color : '#555', // Colored text when active, gray when not
    flex: 1,
    boxShadow: activeTab === name ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', // Subtle shadow for active tab
    transition: 'all 0.2s ease'
  });

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🚀 Manager Dashboard</h2>
        <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </div>

      {/* --- NAVIGATION BAR WITH GRAY BACKGROUND --- */}
      <div style={{ 
        display: 'flex', 
        background: '#f3f4f6', // Light gray background to make white border visible
        padding: '8px', 
        borderRadius: '12px',
        marginBottom: '20px' 
      }}>
        <button onClick={() => setActiveTab("Pending")} style={tabStyle("Pending", "#ca8a04")}>
          🟡 Pending ({pendingOrders.length})
        </button>
        <button onClick={() => setActiveTab("Delivered")} style={tabStyle("Delivered", "#2563eb")}>
          🚚 Delivery ({deliveredOrders.length})
        </button>
        <button onClick={() => setActiveTab("Received")} style={tabStyle("Received", "#16a34a")}>
          ✅ Received ({receivedOrders.length})
        </button>
      </div>

      <div className="order-list">
        {currentList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888', background: '#f9fafb', borderRadius: '10px', border: '2px dashed #ddd' }}>
              No orders in this category.
            </div>
        ) : (
          currentList.map(order => (
            <div key={order._id} className="order-card" style={{ borderLeft: `5px solid ${activeTab === 'Delivered' ? '#2563eb' : activeTab === 'Received' ? '#16a34a' : '#ca8a04'}` }}>
              
              <div className="order-header">
                <span className="order-id">#{order._id.slice(-6)}</span>
                <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
              </div>
              
              <h3>{order.customerName}</h3>
              <p>📞 {order.phone}</p>
              <p>📍 {order.address}</p>
              <p>🛒 <strong>{order.products}</strong></p>
              
              <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                {activeTab === "Pending" && (
                   <button onClick={() => updateStatus(order._id, "Delivered")} style={{ flex: 1, padding: '10px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                     Mark as Sent 🚚
                   </button>
                )}
                
                {activeTab === "Delivered" && (
                  <button onClick={() => updateStatus(order._id, "Received")} style={{ flex: 1, padding: '10px', background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Mark as Done ✅
                  </button>
                )}
              </div>

              <button onClick={() => generateInvoice(order)} className="btn-invoice" style={{ marginTop: '10px' }}>
                Print Invoice
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;