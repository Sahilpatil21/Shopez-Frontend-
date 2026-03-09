import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { adminAPI, orderAPI } from '../services/api';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    mainImg: '',
    carousel: [],
    sizes: [],
    category: '',
    gender: 'unisex',
    price: 0,
    discount: 0
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
    const fetchData = async () => {
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          adminAPI.getOrders(),
          adminAPI.getProducts()
        ]);
        setOrders(ordersResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addProduct(productForm);
      alert('Product added successfully!');
      setShowAddProduct(false);
      resetProductForm();
      // Refresh products
      const productsResponse = await adminAPI.getProducts();
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      mainImg: product.mainImg,
      carousel: product.carousel || [],
      sizes: product.sizes || [],
      category: product.category,
      gender: product.gender,
      price: product.price,
      discount: product.discount
    });
    setShowEditProduct(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateProduct(editingProduct._id, productForm);
      alert('Product updated successfully!');
      setShowEditProduct(false);
      setEditingProduct(null);
      resetProductForm();
      // Refresh products
      const productsResponse = await adminAPI.getProducts();
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(productId);
        alert('Product deleted successfully!');
        // Refresh products
        const productsResponse = await adminAPI.getProducts();
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      alert('Order status updated successfully!');
      // Refresh orders
      const ordersResponse = await adminAPI.getOrders();
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const resetProductForm = () => {
    setProductForm({
      title: '',
      description: '',
      mainImg: '',
      carousel: [],
      sizes: [],
      category: '',
      gender: 'unisex',
      price: 0,
      discount: 0
    });
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'sizes' || name === 'carousel') {
      const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
      setProductForm({ ...productForm, [name]: arrayValue });
    } else if (name === 'price' || name === 'discount') {
      setProductForm({ ...productForm, [name]: parseFloat(value) || 0 });
    } else {
      setProductForm({ ...productForm, [name]: value });
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <Navbar />
      
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
      </div>

      <div className="admin-content">
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
          <div className="admin-card" style={{ flex: '1' }}>
            <h3>Quick Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="card" style={{ background: 'var(--success-color)', color: 'white', textAlign: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '2rem' }}>{orders.length}</h4>
                <p>Total Orders</p>
              </div>
              <div className="card" style={{ background: 'var(--info-color)', color: 'white', textAlign: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '2rem' }}>
                  {orders.filter(order => order.orderStatus === 'order placed').length}
                </h4>
                <p>Pending Orders</p>
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ flex: '2' }}>
            <h3>Recent Orders</h3>
            <div style={{ background: 'var(--white)', borderRadius: '8px', padding: '16px' }}>
              {orders.slice(0, 5).map((order) => {
                const orderPrice = order.price - (order.price * order.discount / 100);
                return (
                  <div key={order._id} style={{ 
                    borderBottom: '1px solid var(--border-color)', 
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background-color 0.3s ease'
                  }}>
                    <div style={{ flex: '1' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>{order.title}</h4>
                      <p style={{ margin: '0 0 4px 0', color: 'var(--gray-color)', fontSize: '0.8rem' }}>
                        {order.name} • {order.email} • {order.mobile}
                      </p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem' }}>
                        {formatPrice(orderPrice)} • Qty: {order.quantity}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`status-badge status-${order.orderStatus.replace(' ', '-')}`}>
                        {order.orderStatus}
                      </span>
                      <div style={{ marginTop: '8px' }}>
                        <select 
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.8rem',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          <option value="order placed">Order Placed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          <div className="admin-card">
            <h3>Product Management</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddProduct(!showAddProduct)}
              >
                {showAddProduct ? 'Cancel' : 'Add Product'}
              </button>
            </div>
            
            {(showAddProduct || showEditProduct) && (
              <form onSubmit={showAddProduct ? handleAddProduct : handleUpdateProduct} className="admin-form">
                <h4 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>
                  {showAddProduct ? 'Add New Product' : 'Edit Product'}
                </h4>
                
                <div className="form-group">
                  <label>Product Title</label>
                  <input
                    type="text"
                    name="title"
                    value={productForm.title}
                    onChange={handleProductFormChange}
                    placeholder="Enter product title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    placeholder="Enter product description"
                    rows="4"
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={handleProductFormChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={productForm.discount}
                      onChange={handleProductFormChange}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductFormChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Mobiles">Mobiles</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={productForm.gender}
                      onChange={handleProductFormChange}
                    >
                      <option value="unisex">Unisex</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="mainImg"
                    value={productForm.mainImg}
                    onChange={handleProductFormChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sizes (comma-separated)</label>
                  <input
                    type="text"
                    name="sizes"
                    value={productForm.sizes.join(', ')}
                    onChange={handleProductFormChange}
                    placeholder="S, M, L, XL"
                  />
                </div>

                <div className="form-group">
                  <label>Carousel Images (comma-separated)</label>
                  <input
                    type="text"
                    name="carousel"
                    value={productForm.carousel.join(', ')}
                    onChange={handleProductFormChange}
                    placeholder="image1.jpg, image2.jpg"
                  />
                </div>

                <button type="submit" className="btn btn-success" style={{ marginTop: '16px' }}>
                  {showAddProduct ? 'Add Product' : 'Update Product'}
                </button>
              </form>
            )}
          </div>

          <div className="admin-card">
            <h3>All Products</h3>
            <div style={{ background: 'var(--white)', borderRadius: '8px', padding: '16px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img 
                            src={product.mainImg} 
                            alt={product.title} 
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '4px',
                              objectFit: 'cover'
                            }} 
                          />
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{product.title}</div>
                            <div style={{ color: 'var(--gray-color)', fontSize: '0.8rem' }}>
                              {product.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge`} style={{ 
                          background: product.category === 'Electronics' ? 'var(--info-color)' :
                                     product.category === 'Fashion' ? 'var(--accent-color)' :
                                     product.category === 'Mobiles' ? 'var(--primary-color)' :
                                     product.category === 'Groceries' ? 'var(--success-color)' :
                                     'var(--warning-color)'
                        }}>
                          {product.category}
                        </span>
                      </td>
                      <td>{formatPrice(product.price - (product.price * product.discount / 100))}</td>
                      <td>
                        <span style={{ 
                          color: product.sizes && product.sizes.length > 0 ? 'var(--success-color)' : 'var(--gray-color)',
                          fontWeight: '600'
                        }}>
                          {product.sizes && product.sizes.length > 0 ? 'In Stock' : 'One Size'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEditProduct(product)}
                            style={{ fontSize: '0.8rem' }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm" 
                            style={{ 
                              background: 'var(--danger-color)', 
                              color: 'var(--white)', 
                              border: 'none',
                              fontSize: '0.8rem'
                            }}
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: '24px' }}>
          <h3>All Orders Management</h3>
          <div style={{ background: 'var(--white)', borderRadius: '8px', padding: '16px' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const orderAmount = (order.price - (order.price * order.discount / 100)) * order.quantity;
                  return (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8)}</td>
                      <td>{order.name}</td>
                      <td>{order.title}</td>
                      <td>{formatPrice(orderAmount)}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge status-${order.orderStatus.replace(' ', '-')}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                          <select 
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.8rem',
                              border: '1px solid var(--border-color)',
                              width: '100%'
                            }}
                          >
                            <option value="order placed">Order Placed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                            <button 
                              className="btn btn-sm" 
                              style={{ 
                                background: 'var(--danger-color)', 
                                color: 'var(--white)', 
                                border: 'none',
                                marginTop: '4px'
                              }}
                              onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
