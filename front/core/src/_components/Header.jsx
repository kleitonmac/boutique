import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
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
                        <a href="#">Início</a>
                    </li>
                    <li>
                        <a href="#">Sobre</a>
                    </li>
                    <li>
                        <a href="#">Contatos</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;