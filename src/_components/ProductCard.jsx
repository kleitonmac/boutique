import React from 'react';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="product-overlay">
          <button 
            className="btn-quick-view"
            onClick={() => onViewDetails(product.id)}
          >
            Ver detalhes
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">R$ {product.price.toFixed(2)}</p>
        <button 
          className="btn-add-cart"
          onClick={() => onAddToCart(product)}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
