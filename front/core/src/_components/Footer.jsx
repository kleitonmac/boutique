import React from 'react';
import { FaWhatsapp, FaInstagram, FaEnvelope, FaFacebook, FaTwitter } from "react-icons/fa6";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Alana Boutique</h3>
          <p>Sua loja de moda sofisticada e acessível. Descubra seu estilo único conosco.</p>
          <div className="social-icons">
            <a
              href="https://wa.me/5511961728584"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href="https://www.instagram.com/alanareis__/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
            <a 
              href="mailto:contato@alanaboutique.com"
              aria-label="Email"
            >
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Produtos</h4>
          <ul>
            <li><a href="#produtos">Feminino</a></li>
            <li><a href="#produtos">Masculino</a></li>
            <li><a href="#produtos">Acessórios</a></li>
            <li><a href="#produtos">Novidades</a></li>
            <li><a href="#produtos">Ofertas</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Atendimento</h4>
          <ul>
            <li><a href="#contato">Fale Conosco</a></li>
            <li><a href="#contato">Trocas e Devoluções</a></li>
            <li><a href="#contato">Formas de Pagamento</a></li>
            <li><a href="#contato">Frete e Entrega</a></li>
            <li><a href="#contato">Tamanhos</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Institucional</h4>
          <ul>
            <li><a href="#sobre">Sobre Nós</a></li>
            <li><a href="/politica-privacidade">Política de Privacidade</a></li>
            <li><a href="/termos-uso">Termos de Uso</a></li>
            <li><a href="/politica-cookies">Política de Cookies</a></li>
            <li><a href="/trabalhe-conosco">Trabalhe Conosco</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Alana Boutique. Todos os direitos reservados.</p>
        <p>Desenvolvido com ❤️ para você</p>
      </div>
    </footer>
  );
};

export default Footer;
