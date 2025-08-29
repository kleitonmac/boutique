import React from 'react';

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedSize,
  onSizeChange,
  selectedColor,
  onColorChange
}) => {
  const categories = ['Todos', 'Feminino', 'Masculino', 'Acessórios'];
  const sizes = ['P', 'M', 'G', 'GG', 'XG'];
  const colors = ['Preto', 'Branco', 'Azul', 'Vermelho', 'Verde', 'Rosa'];

  return (
    <div className="search-filters">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <button className="search-btn">🔍</button>
      </div>
      
      <div className="filters-container">
        <div className="filter-group">
          <label>Categoria:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => onCategoryChange(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Preço máximo: R$ {priceRange}</label>
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange}
            onChange={(e) => onPriceRangeChange(e.target.value)}
            className="price-slider"
          />
        </div>
        
        <div className="filter-group">
          <label>Tamanho:</label>
          <div className="size-filters">
            {sizes.map(size => (
              <button
                key={size}
                className={`size-filter-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => onSizeChange(selectedSize === size ? '' : size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <label>Cor:</label>
          <div className="color-filters">
            {colors.map(color => (
              <button
                key={color}
                className={`color-filter-btn ${selectedColor === color ? 'active' : ''}`}
                onClick={() => onColorChange(selectedColor === color ? '' : color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
