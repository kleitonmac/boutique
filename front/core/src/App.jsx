
import React, { useState, useEffect } from "react";
import "./App.css";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import ProductCard from "./_components/ProductCard";
import ShoppingCart from "./_components/ShoppingCart";
import ProductModal from "./_components/ProductModal";
import SearchAndFilters from "./_components/SearchAndFilters";
import Notification from "./_components/Notification";
import Checkout from "./_components/Checkout";
import Favorites from "./_components/Favorites";
import { products } from "./data/products";

function App() {
  // Estados principais
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success', isVisible: false });

  // Estados de busca e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [priceRange, setPriceRange] = useState(500);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Aplicar tema escuro
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Carregar favoritos do localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Salvar favoritos no localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filtrar produtos com busca melhorada
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.sizes?.some(size => size.toLowerCase().includes(searchLower)) ||
      product.colors?.some(color => color.toLowerCase().includes(searchLower));
    
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesPrice = product.price <= priceRange;
    const matchesSize = !selectedSize || (product.sizes && product.sizes.includes(selectedSize));
    const matchesColor = !selectedColor || (product.colors && product.colors.includes(selectedColor));
    
    return matchesSearch && matchesCategory && matchesPrice && matchesSize && matchesColor;
  });

  // Funções do carrinho
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => 
      item.id === product.id && 
      item.size === product.size && 
      item.color === product.color
    );

    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item === existingItem 
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: product.quantity || 1 }]);
    }

    showNotification('Produto adicionado ao carrinho!', 'success');
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
    showNotification('Produto removido do carrinho!', 'info');
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Funções de favoritos
  const toggleFavorite = (product) => {
    const isFavorite = favorites.some(fav => fav.id === product.id);
    
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== product.id));
      showNotification('Produto removido dos favoritos!', 'info');
    } else {
      setFavorites([...favorites, product]);
      showNotification('Produto adicionado aos favoritos!', 'success');
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId);
  };

  // Funções de checkout
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = () => {
    setCartItems([]);
    showNotification('Compra finalizada com sucesso! Email de confirmação enviado.', 'success');
  };

  // Funções de notificação
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
  };

  const hideNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  // Funções de produto
  const handleViewProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={favorites.length}
        onCartClick={() => setIsCartOpen(true)}
        onFavoritesClick={() => {
          document.getElementById("favoritos")?.scrollIntoView({ behavior: "smooth" });
        }}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      {/* ===== MAIN COM VÍDEO DE FUNDO ===== */}
      <main className="video-header" id="inicio">
        <div className="video-split">
          <div className="video-left">
            <video src="/videos/roupas.mp4" loop muted autoPlay playsInline />
          </div>
          <div className="video-right">
            <video src="/videos/roupas2.mp4" loop muted autoPlay playsInline />
          </div>
        </div>

        <div className="container">
          <h1>Alana Boutique — Seu charme começa aqui.</h1>
          <p>Não siga tendências. Crie as suas.</p>
          <div className="ofertas">
            <button
              onClick={() => {
                document
                  .getElementById("produtos")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Clique aqui para conferir nossas ofertas!
            </button>
          </div>
        </div>
      </main>

      {/* ===== BANNER ===== */}
      <section className="banner">
        <div className="banner-right"></div>
      </section>

      {/* ===== PRODUTOS ===== */}
      <section id="produtos" className="produtos-section">
        <div className="container-produtos">
          <h2>Nossos Produtos</h2>
          
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={handleViewProduct}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite(product.id)}
                />
              ))
            ) : (
              <div className="no-products">
                <p>Nenhum produto encontrado com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== FAVORITOS ===== */}
      {favorites.length > 0 && (
        <section id="favoritos" className="favoritos-section">
          <div className="container-produtos">
            <Favorites
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onAddToCart={addToCart}
            />
          </div>
        </section>
      )}

      {/* ===== SOBRE A LOJA ===== */}
      <section id="sobre" className="sobre">
        <h2>Sobre a nossa loja</h2>
        <p>
          A <strong>Alana Boutique</strong> nasceu com o propósito de oferecer
          moda sofisticada e acessível para todos os estilos. Nosso compromisso
          é trazer peças exclusivas que realçam a beleza e a confiança de cada
          cliente.
        </p>
      </section>

      {/* ===== CONTATO ===== */}
      <section id="contato" className="contato">
        <h2>Entre em Contato</h2>
        <div className="contato-info">
          <div className="contato-item">
            <h3>📞 Telefone</h3>
            <p>(11) 99999-9999</p>
          </div>
          <div className="contato-item">
            <h3>📧 Email</h3>
            <p>contato@alanaboutique.com</p>
          </div>
          <div className="contato-item">
            <h3>📍 Endereço</h3>
            <p>Rua das Flores, 123 - São Paulo, SP</p>
          </div>
        </div>
      </section>

      <Footer />

      {/* ===== COMPONENTES MODAIS ===== */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
        onCheckout={handleCheckout}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onAddToCart={addToCart}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        total={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
        onCheckoutComplete={handleCheckoutComplete}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
}

export default App;
