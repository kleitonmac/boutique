import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Favorites = ({ favorites, onToggleFavorite, onAddToCart }) => {
  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <p>Nenhum produto favoritado ainda</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h2>Meus Favoritos</h2>
      <div className="favorites-grid">
        {favorites.map((product) => (
          <div key={product.id} className="favorite-item">
            <div className="favorite-image">
              <img src={product.image} alt={product.name} />
              <button 
                className="favorite-toggle active"
                onClick={() => onToggleFavorite(product)}
              >
                <FaHeart />
              </button>
            </div>
            <div className="favorite-info">
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
        ))}
      </div>
    </div>
  );
};

export default Favorites;

