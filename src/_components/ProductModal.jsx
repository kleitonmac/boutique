import React, { useState } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Por favor, selecione o tamanho e a cor');
      return;
    }
    
    onAddToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    onClose();
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="product-modal-content">
          <div className="product-gallery">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product-details">
            <h2>{product.name}</h2>
            <p className="product-category">{product.category}</p>
            <p className="product-price">R$ {product.price.toFixed(2)}</p>
            
            <div className="product-description">
              <h3>Descrição</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="product-options">
              <div className="option-group">
                <h4>Tamanho</h4>
                <div className="size-options">
                  {product.sizes?.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="option-group">
                <h4>Cor</h4>
                <div className="color-options">
                  {product.colors?.map(color => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="option-group">
                <h4>Quantidade</h4>
                <div className="quantity-selector">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              className="btn-add-to-cart-modal"
              onClick={handleAddToCart}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
