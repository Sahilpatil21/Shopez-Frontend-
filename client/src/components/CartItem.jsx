import React from 'react';

const CartItem = ({ item, onRemove }) => {
  const discountedPrice = item.price - (item.price * item.discount / 100);
  const totalPrice = discountedPrice * item.quantity;

  return (
    <div className="cart-item">
      <img src={item.mainImg} alt={item.title} />
      <div className="cart-item-info">
        <h4>{item.title}</h4>
        <p>{item.description}</p>
        <p>Size: {item.size}</p>
        <p>Quantity: {item.quantity}</p>
        <div className="cart-item-price">
          ${totalPrice.toFixed(2)}
          {item.discount > 0 && (
            <span style={{ textDecoration: 'line-through', marginLeft: '10px', color: '#999' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          )}
        </div>
      </div>
      <button 
        onClick={() => onRemove(item._id)} 
        className="remove-btn"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
