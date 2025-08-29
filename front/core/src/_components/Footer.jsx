import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      {/* ===== REDES SOCIAIS ===== */}
      <div className="social-icons">
        <a
          href="https://wa.me/5511961728584"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={24} />
        </a>
        <a
          href="https://www.instagram.com/alanareis__/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={24} />
        </a>
        <a href="mailto:contato@alanaboutique.com">
          <FaEnvelope size={24} />
        </a>
      </div>

      <div className="footer">
        <p>© 2025 Alana Boutique. Todos os direitos reservados.</p>
      </div>
    </>
  );
};

export default Footer;
