import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './ProductCard.css';


const ProductCard = ({ product, onAddToCart, onViewDetails, onToggleFavorite, isFavorite }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <button 
          className="favorite-toggle"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
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
