
import "./App.css";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
function App() {
 

  return (
    <>
      <Header />
      {/* ===== MAIN COM VÍDEO DE FUNDO ===== */}

      <main className="video-header">
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
          <p>Não siga tendências. Crie as suas </p>
           {/* ===== BOTÃO DE OFERTAS ===== */}
      <div className="ofertas">
        <button
          onClick={() => {
            document
              .getElementById("novidades")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Clique aqui para conferir nossas ofertas!
        </button>
      </div>
      
        </div>
      </main>

      {/* ===== BANNER ===== */}
      <section class="banner">
        <div class="banner-right"></div>
      </section>

      {/* ===== PRODUTOS ===== */}
      <section id="novidades" className="novidades">
        <h2>Novidades</h2>
        <div className="marquee">
          <div className="marquee-content">
            {/* Produto 1 */}

            <a href="/produto/vestido-floral" className="produto">
              <img
                src="https://via.placeholder.com/200x250"
                alt="Vestido Floral"
              />
              <h3>Vestido Floral</h3>
              <p>R$129,90</p>
            </a>

            {/* Produto 2 */}
            <a href="/produto/blusa-elegante" className="produto">
              <img
                src="https://via.placeholder.com/200x250"
                alt="Blusa Elegante"
              />
              <h3>Blusa Elegante</h3>
              <p>R$89,90</p>
            </a>

            {/* Produto 3 */}
            <a href="/produto/calca-jeans" className="produto">
              <img
                src="https://via.placeholder.com/200x250"
                alt="Calça Jeans"
              />
              <h3>Calça Jeans</h3>
              <p>R$149,90</p>
            </a>
          </div>
        </div>
      </section>

      {/* ===== SOBRE A LOJA ===== */}
      <section className="sobre">
        <h2>Sobre a nossa loja</h2>
        <p>
          A <strong>Alana Boutique</strong> nasceu com o propósito de oferecer
          moda sofisticada e acessível para todos os estilos. Nosso compromisso
          é trazer peças exclusivas que realçam a beleza e a confiança de cada
          cliente.
        </p>
      </section>

      <Footer />
    </>
  );
}

export default App;
