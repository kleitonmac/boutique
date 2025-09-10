import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaShoppingCart, FaStar } from "react-icons/fa";
import "./Header.css";

const Header = ({ 
  cartItemsCount,
  favoritesCount, // Nova prop para contar favoritos
  onCartClick, 
  onFavoritesClick, // Nova prop para clique em favoritos
  isDarkMode, 
  onThemeToggle 
}) => {
    const menuRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    // Função para fechar menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return(
        <header className="header-transparente">
          {/* Menu fixo na esquerda */}
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)} 
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
              <span className="menu-text">
                {menuOpen ? "Fechar" : "Menu"}
              </span>
            </button>
          </div>

          {/* Nome centralizado */}
          <div className="header-center">
            <h1 className="header-title">Alana Boutique</h1>
          </div>

          <div className="header-right">
            <div className="header-controls">
              <button className="theme-toggle" onClick={onThemeToggle}>
                {isDarkMode ? "☀️" : "🌙"}
              </button>
              <button className="cart-icon" onClick={onCartClick}>
                <FaShoppingCart />
                {cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
              </button>
              <button className="favorites-icon" onClick={onFavoritesClick}>
                <FaStar />
                {favoritesCount > 0 && (
                  <span className="favorites-badge">{favoritesCount}</span>
                )}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="menu-overlay-full">
              <nav className="menu-professional" ref={menuRef}>
                <button
                  className="menu-toggle close-menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaTimes /> <span className="menu-text">Fechar</span>
                </button>
                <ul className="menu-links-professional">
                  <li><a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a></li>
                  <li><a href="#produtos" onClick={() => setMenuOpen(false)}>Produtos</a></li>
                  <li><a href="#favoritos" onClick={() => setMenuOpen(false)}>Favoritos</a></li>
                  <li><a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a></li>
                  <li><a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a></li>
                </ul>
              </nav>
            </div>
          )}
        </header>
    )
}

export default Header;