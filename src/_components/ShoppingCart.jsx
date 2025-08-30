import React from 'react';

const ShoppingCart = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Seu Carrinho</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <p className="cart-empty">Seu carrinho está vazio</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>R$ {item.price.toFixed(2)}</p>
                      {item.size && <p>Tamanho: {item.size}</p>}
                      {item.color && <p>Cor: {item.color}</p>}
                      <div className="quantity-controls">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      className="btn-remove"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: R$ {total.toFixed(2)}</strong>
                </div>
                <button className="btn-checkout" onClick={onCheckout}>
                  Finalizar Compra
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
