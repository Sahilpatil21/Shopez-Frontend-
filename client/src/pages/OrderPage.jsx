import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { productAPI, orderAPI } from '../services/api';

const OrderPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProductById(productId);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (!userData._id) {
        alert('Please login to place an order');
        return;
      }

      const order = {
        userId: userData._id,
        productId: product._id,
        title: product.title,
        description: product.description,
        mainImg: product.mainImg,
        size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size',
        quantity: 1,
        price: product.price,
        discount: product.discount,
        ...orderData,
        orderDate: new Date().toISOString(),
        orderStatus: 'order placed'
      };

      await orderAPI.createOrder(order);
      alert('Order placed successfully!');
      setOrderData({
        name: '',
        email: '',
        mobile: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod'
      });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <h3>Product not found</h3>
            <p>The product you're looking for doesn't exist.</p>
            <a href="/products" className="btn btn-primary">Back to Products</a>
          </div>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * product.discount / 100);

  return (
    <div>
      <Navbar />
      
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <img src={product.mainImg} alt={product.title} style={{ 
              width: '100%', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }} />
            
            <div className="card">
              <h2>{product.title}</h2>
              <p style={{ color: 'var(--gray-color)', lineHeight: '1.6', marginBottom: '20px' }}>
                {product.description}
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-color)' }}>
                    {formatPrice(discountedPrice)}
                  </span>
                  {product.discount > 0 && (
                    <span style={{ 
                      background: 'var(--success-color)', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem' 
                    }}>
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                
                {product.discount > 0 && (
                  <div style={{ color: 'var(--gray-color)', textDecoration: 'line-through' }}>
                    Original Price: {formatPrice(product.price)}
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <h4>Available Sizes:</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((size, index) => (
                      <span key={index} style={{ 
                        border: '1px solid var(--border-color)', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}>
                        {size}
                      </span>
                    ))
                  ) : (
                    <span style={{ 
                      border: '1px solid var(--border-color)', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      One Size
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>Place Order</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={orderData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={orderData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={orderData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  name="address"
                  value={orderData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={orderData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={orderData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={orderData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={orderData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="online">Online Payment</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                Place Order • {formatPrice(discountedPrice)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
