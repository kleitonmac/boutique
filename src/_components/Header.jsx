import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Header = ({ 
  cartItemsCount, 
  onCartClick, 
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
          {/* Esquerda - Menu */}
          <div className="header-left">
            <nav className="menu" ref={menuRef}>
              <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)} 
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
                <span className="menu-text">
                  {menuOpen ? "Fechar" : "Menu"}
                </span>
              </button>

              <ul className={`menu-links ${menuOpen ? "show" : ""}`}>
                <li><a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a></li>
                <li><a href="#produtos" onClick={() => setMenuOpen(false)}>Produtos</a></li>
                <li><a href="#servicos" onClick={() => setMenuOpen(false)}>Serviços</a></li>
                <li><a href="#contato" onClick={() => setMenuOpen(false)}>Contatos</a></li>
              </ul>
            </nav>
          </div>

          {/* Centro - Logo/Título */}
          <div className="header-center">
            <h1 className="header-title">L B</h1>
          </div>

          {/* Direita - Botões de Ação */}
          <div className="header-right">
            <div className="header-controls">
              {/* Botão de tema */}
              <button className="theme-toggle" onClick={onThemeToggle}>
                {isDarkMode ? "☀️" : "🌙"}
              </button>

              {/* Botão do carrinho */}
              <button className="cart-icon" onClick={onCartClick}>
                <FaShoppingCart />
                {cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
              </button>
            </div>
          </div>
        </header>
    )
}

export default Header;