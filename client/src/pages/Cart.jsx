import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import { cartAPI, userAPI } from '../services/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        
        if (userData._id) {
          const response = await cartAPI.getCart(userData._id);
          setCartItems(response.data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.price - (item.price * item.discount / 100);
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const handleRemove = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      setCartItems(cartItems.filter(item => item._id !== itemId));
      alert('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const handlePlaceOrder = () => {
    alert('Proceeding to checkout...');
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="container">
        <h2 style={{ marginBottom: '32px', color: 'var(--primary-color)' }}>Shopping Cart</h2>
        
        {cartItems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <h3 style={{ color: 'var(--gray-color)', marginBottom: '16px' }}>Your cart is empty</h3>
            <p style={{ color: 'var(--gray-color)', marginBottom: '24px' }}>
              Looks like you haven't added anything to your cart yet.
            </p>
            <a href="/products" className="btn btn-primary">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            <div>
              {cartItems.map((item) => {
                const itemPrice = item.price - (item.price * item.discount / 100);
                return (
                  <div key={item._id} className="cart-item">
                    <img src={item.mainImg} alt={item.title} />
                    <div className="cart-item-info">
                      <h4>{item.title}</h4>
                      <p>Size: {item.size}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price per item: {formatPrice(itemPrice)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="cart-item-price">
                        {formatPrice(itemPrice * item.quantity)}
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemove(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="price-details">
              <h3 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>Order Summary</h3>
              
              <div className="price-row">
                <span>Subtotal</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              
              <div className="price-row">
                <span>Delivery</span>
                <span>{formatPrice(50)}</span>
              </div>
              
              <div className="price-row">
                <span>Tax (18% GST)</span>
                <span>{formatPrice(calculateTotal() * 0.18)}</span>
              </div>
              
              <hr style={{ margin: '20px 0', borderColor: 'var(--border-color)' }} />
              
              <div className="price-row total-price">
                <span>Total</span>
                <span>{formatPrice(calculateTotal() + 50 + (calculateTotal() * 0.18))}</span>
              </div>
              
              <button 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '24px', padding: '16px' }}
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
