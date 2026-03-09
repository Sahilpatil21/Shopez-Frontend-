import React from 'react';
import { Link } from 'react-router-dom';
import { cartAPI } from '../services/api';

const ProductCard = ({ product, onAddToCart }) => {
  const discountedPrice = product.price - (product.price * product.discount / 100);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user._id) {
        alert('Please login to add items to cart');
        return;
      }

      const cartData = {
        userId: user._id,
        title: product.title,
        description: product.description,
        mainImg: product.mainImg,
        size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size',
        quantity: 1,
        price: product.price,
        discount: product.discount
      };

      await cartAPI.addToCart(cartData);
      alert('Product added to cart successfully!');
      if (onAddToCart) {
        onAddToCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  return (
    <div className="product-card">
      <img src={product.mainImg} alt={product.title} />
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          {product.discount > 0 ? (
            <>
              <span style={{ textDecoration: 'line-through', marginRight: '10px', color: 'var(--gray-color)' }}>
                {formatPrice(product.price)}
              </span>
              <span style={{ color: 'var(--accent-color)', fontWeight: '700' }}>
                {formatPrice(discountedPrice)}
              </span>
            </>
          ) : (
            <span style={{ color: 'var(--accent-color)', fontWeight: '700' }}>
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {product.discount > 0 && (
          <div style={{ color: '#28a745', fontSize: '0.9rem' }}>
            {product.discount}% OFF
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Link to={`/order/${product._id}`} className="btn" style={{ flex: '1' }}>
            Shop Now
          </Link>
          <button 
            onClick={handleAddToCart}
            className="btn"
            style={{ 
              backgroundColor: '#28a745',
              flex: '1'
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
