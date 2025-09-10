import React, { useState } from 'react';
import { FaCreditCard, FaPaypal, FaLock } from 'react-icons/fa';
import './Checkout.css';

const Checkout = ({ isOpen, onClose, cartItems, total, onCheckoutComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    paymentMethod: 'credit'
  });

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Enviar email de confirmação
      await sendConfirmationEmail(formData.email, cartItems, total);
      
      onCheckoutComplete();
      onClose();
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const sendConfirmationEmail = async (email, items, total) => {
    // Aqui você implementaria a lógica de envio de email
    console.log('Enviando email de confirmação para:', email);
    console.log('Itens:', items);
    console.log('Total:', total);
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>Finalizar Compra</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="checkout-content">
          <div className="checkout-summary">
            <h3>Resumo do Pedido</h3>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantidade: {item.quantity}</p>
                    <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <strong>Total: R$ {total.toFixed(2)}</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h3>Informações Pessoais</h3>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Endereço de Entrega</h3>
              <input
                type="text"
                name="address"
                placeholder="Endereço completo"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="Cidade"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="CEP"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Forma de Pagamento</h3>
              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    checked={formData.paymentMethod === 'credit'}
                    onChange={handleInputChange}
                  />
                  <FaCreditCard />
                  Cartão de Crédito
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                  />
                  <FaPaypal />
                  PayPal
                </label>
              </div>

              {formData.paymentMethod === 'credit' && (
                <div className="card-details">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Número do cartão"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="form-row">
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/AA"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="cardCvv"
                      placeholder="CVV"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-security">
              <FaLock />
              <span>Pagamento seguro com criptografia SSL</span>
            </div>

            <button 
              type="submit" 
              className="btn-checkout-submit"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Finalizar Compra'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
