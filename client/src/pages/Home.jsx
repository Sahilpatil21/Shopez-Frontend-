import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { name: 'Fashion', image: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Electronics', image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Mobiles', image: 'https://images.pexels.com/photos/794465/pexels-photo-794465.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Groceries', image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Sports Equipments', image: 'https://images.pexels.com/photos/1550340/pexels-photo-1550340.jpeg?auto=compress&cs=tinysrgb&w=100' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts();
        setProducts(response.data.slice(0, 6)); // Show first 6 products
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="banner">
        <div style={{ position: 'relative', zIndex: '2' }}>
          <h1>Welcome to ShopEZ</h1>
          <p>Discover amazing products at unbeatable prices starting from ₹99</p>
          <Link to="/products" className="btn btn-lg" style={{ background: 'var(--white)', color: 'var(--primary-color)', fontWeight: '700' }}>
            Shop Now
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="categories">
          {categories.map((category, index) => (
            <div key={index} className="category">
              <Link to={`/products?category=${category.name}`} style={{ textDecoration: 'none' }}>
                <img src={category.image} alt={category.name} />
                <h4>{category.name}</h4>
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', margin: '60px 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '16px' }}>
            Featured Products
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--gray-color)', maxWidth: '600px', margin: '0 auto 32px' }}>
            Handpicked products just for you. Quality guaranteed, prices you'll love.
          </p>
        </div>

        <div style={{ marginBottom: '32px', padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: '16px', maxWidth: '800px', margin: '0 auto 32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: '1',
                minWidth: '300px',
                padding: '12px 20px',
                border: '2px solid var(--border-color)',
                borderRadius: '50px',
                fontSize: '14px',
                background: 'var(--white)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '12px 20px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--white)',
                cursor: 'pointer'
              }}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Groceries">Groceries</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div style={{ textAlign: 'center', margin: '60px 0' }}>
          <Link to="/products" className="btn btn-primary btn-lg">
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
