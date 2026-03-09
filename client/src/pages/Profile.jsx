import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { orderAPI, userAPI } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!userData._id) {
          setLoading(false);
          return;
        }

        const [profileResponse, ordersResponse] = await Promise.all([
          userAPI.getProfile(),
          orderAPI.getOrders(userData._id)
        ]);
        
        setUser(profileResponse.data);
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderAPI.cancelOrder(orderId);
      alert('Order cancelled successfully');
      // Refresh orders to get updated status
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData._id) {
        const ordersResponse = await orderAPI.getOrders(userData._id);
        setOrders(ordersResponse.data);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="container">
        <div style={{ display: 'flex', gap: '30px' }}>
          {/* User Details Section */}
          <div style={{ flex: '1' }}>
            <div className="card">
              <h3>User Details</h3>
              {user && (
                <>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>User Type:</strong> {user.usertype}</p>
                  <p><strong>Number of Orders:</strong> {orders.length}</p>
                  
                  <button 
                    onClick={handleLogout}
                    className="btn"
                    style={{ marginTop: '20px', backgroundColor: '#dc3545' }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Orders Section */}
          <div style={{ flex: '3' }}>
            <div className="card">
              <h3>Your Orders</h3>
              
              {orders.length === 0 ? (
                <p>No orders placed yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map((order) => (
                    <div key={order._id} style={{ 
                      border: '1px solid #ddd', 
                      borderRadius: '8px', 
                      padding: '15px',
                      display: 'flex',
                      gap: '20px'
                    }}>
                      <img 
                        src={order.mainImg} 
                        alt={order.title}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      
                      <div style={{ flex: '1' }}>
                        <h4>{order.title}</h4>
                        <p>{order.description}</p>
                        <p><strong>Size:</strong> {order.size}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                        <p><strong>Price:</strong> {formatPrice(order.price - (order.price * order.discount / 100))}</p>
                        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                        <p><strong>Shipping Address:</strong> {order.address}</p>
                        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> <span style={{ 
                          color: order.orderStatus === 'delivered' ? '#28a745' : 
                                 order.orderStatus === 'cancelled' ? '#dc3545' : '#ffc107',
                          fontWeight: 'bold'
                        }}>{order.orderStatus}</span></p>
                        
                        {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                          <button 
                            onClick={() => handleCancelOrder(order._id)}
                            className="remove-btn"
                            style={{ marginTop: '10px' }}
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
