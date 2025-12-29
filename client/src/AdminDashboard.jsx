import logo from './logo.png';
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
    if (newStatus === "Returned" && !window.confirm("Are you sure this customer returned the product?")) return;
    
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
  const returnedOrders = orders.filter(o => o.status === "Returned"); // <--- NEW FILTER

  const currentList = activeTab === "Pending" ? pendingOrders 
                    : activeTab === "Delivered" ? deliveredOrders 
                    : activeTab === "Received" ? receivedOrders
                    : returnedOrders; // <--- Handle New Tab

  // --- STYLES ---
  const getBorderColor = () => {
    if(activeTab === 'Delivered') return '#2563eb'; // Blue
    if(activeTab === 'Received') return '#16a34a';  // Green
    if(activeTab === 'Returned') return '#dc2626';  // Red
    return '#ca8a04'; // Yellow
  };

  const tabStyle = (name, color) => ({
    padding: '12px 10px', // Adjusted padding to fit 4 tabs
    border: '2px solid white',
    borderRadius: '10px',
    marginRight: '8px',
    background: activeTab === name ? 'white' : 'transparent',
    cursor: 'pointer',
    fontSize: '14px', // Slightly smaller font to fit
    fontWeight: 'bold',
    color: activeTab === name ? color : '#555',
    flex: 1,
    boxShadow: activeTab === name ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  });

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <img src={logo} alt="Logo" style={{ height: '50px', borderRadius: '50%' }} />
  <h2>Manager Dashboard</h2>
</div>
        <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </div>

      {/* --- NAVIGATION BAR --- */}
      <div style={{ 
        display: 'flex', 
        background: '#f3f4f6', 
        padding: '8px', 
        borderRadius: '12px',
        marginBottom: '20px',
        overflowX: 'auto' // Ensures it scrolls on small phones if needed
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
        <button onClick={() => setActiveTab("Returned")} style={tabStyle("Returned", "#dc2626")}>
          ↩️ Returned ({returnedOrders.length})
        </button>
      </div>

      <div className="order-list">
        {currentList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888', background: '#f9fafb', borderRadius: '10px', border: '2px dashed #ddd' }}>
              No orders in this category.
            </div>
        ) : (
          currentList.map(order => (
            <div key={order._id} className="order-card" style={{ borderLeft: `5px solid ${getBorderColor()}` }}>
              
              <div className="order-header">
                <span className="order-id">#{order._id.slice(-6)}</span>
                <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
              </div>
              
              <h3>{order.customerName}</h3>
              <p>📞 {order.phone}</p>
              <p>📍 {order.address}</p>
              <p>🛒 <strong>{order.products}</strong></p>
              
              {/* --- ACTION BUTTONS --- */}
              <div className="actions" style={{ marginTop: '15px' }}>
                
                {/* 1. Buttons for Pending Tab */}
                {activeTab === "Pending" && (
                   <button onClick={() => updateStatus(order._id, "Delivered")} style={{ width: '100%', padding: '10px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                     Mark as Sent 🚚
                   </button>
                )}
                
                {/* 2. Buttons for Delivered Tab */}
                {activeTab === "Delivered" && (
                  <button onClick={() => updateStatus(order._id, "Received")} style={{ width: '100%', padding: '10px', background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Mark as Done ✅
                  </button>
                )}

                {/* 3. Buttons for Received Tab (Print Invoice + Return) */}
                {activeTab === "Received" && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => generateInvoice(order)} className="btn-invoice" style={{ flex: 1, marginTop: '0' }}>
                      Print Invoice
                    </button>
                    <button 
                      onClick={() => updateStatus(order._id, "Returned")} 
                      style={{ flex: 1, padding: '10px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Customer Returned ↩️
                    </button>
                  </div>
                )}

                 {/* 4. Buttons for Returned Tab (Only Invoice) */}
                 {activeTab === "Returned" && (
                  <button onClick={() => generateInvoice(order)} className="btn-invoice" style={{ marginTop: '10px', background: '#ddd', color: '#555' }}>
                    Print Invoice
                  </button>
                )}

                {/* Print Invoice for Pending/Delivered (Outside the flex group) */}
                {(activeTab === "Pending" || activeTab === "Delivered") && (
                   <button onClick={() => generateInvoice(order)} className="btn-invoice" style={{ marginTop: '10px' }}>
                     Print Invoice
                   </button>
                )}

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;