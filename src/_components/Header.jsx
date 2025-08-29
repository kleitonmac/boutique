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
            <nav className="menu" ref={menuRef}> 
                <button
                    className="menu-toggle flex items-center"
                    onClick={() => setMenuOpen(!menuOpen)} 
                >
                    {/* Ícone */}
                    <span className="text-xl">
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </span>

                    {/* Texto */}
                    <span className="ml-2 text-xl font-bold">
                        {menuOpen ? "Fechar" : "Menu"}
                    </span>
                </button>

                {/* Links */}
                <ul className={`menu-links ${menuOpen ? "show" : ""}`}>
                    <li>
                        <a href="#inicio">Início</a>
                    </li>
                    <li>
                        <a href="#produtos">Produtos</a>
                    </li>
                    <li>
                        <a href="#sobre">Sobre</a>
                    </li>
                    <li>
                        <a href="#contato">Contatos</a>
                    </li>
                </ul>
            </nav>

            {/* Carrinho e Tema */}
            <div className="header-controls">
                <ThemeToggle isDarkMode={isDarkMode} onToggle={onThemeToggle} />
                
                <button className="cart-icon" onClick={onCartClick}>
                    <FaShoppingCart />
                    {cartItemsCount > 0 && (
                        <span className="cart-badge">{cartItemsCount}</span>
                    )}
                </button>
            </div>
        </header>
    )
}

export default Header;