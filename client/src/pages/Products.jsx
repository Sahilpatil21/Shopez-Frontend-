import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'name'
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
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesMinPrice = product.price >= filters.minPrice;
    const matchesMaxPrice = product.price <= filters.maxPrice;
    return matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'name') {
      return a.title.localeCompare(b.title);
    } else if (filters.sortBy === 'price') {
      return a.price - b.price;
    }
    return 0;
  });

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="container">
        <h2 style={{ marginBottom: '32px', color: 'var(--primary-color)' }}>All Products</h2>
        
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Filters</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Mobiles">Mobiles</option>
                <option value="Groceries">Groceries</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div className="form-group">
              <label>Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                min="0"
                placeholder="10000"
              />
            </div>

            <div className="form-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </div>

        <div className="product-grid">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <h3 style={{ color: 'var(--gray-color)', marginBottom: '16px' }}>No products found</h3>
            <p style={{ color: 'var(--gray-color)' }}>
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
