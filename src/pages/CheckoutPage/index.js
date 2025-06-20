// src/pages/CheckoutPage/index.js

import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../../services/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// Importando todos os componentes estilizados do arquivo de estilos
import {
  CheckoutPageWrapper,
  Title,
  FormSection,
  FormGroup,
  PaymentOptionsContainer,
  PaymentOptionLabel,
  ConditionalInputWrapper,
  PixKeyDisplay,
  OrderSummary,
  LoadingText
} from './styles';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { settings, loading: loadingSettings } = useStoreSettings();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [trocoPara, setTrocoPara] = useState('');
  const [precisaTroco, setPrecisaTroco] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loadingSettings) {
      if (!settings.isStoreOpen) {
        toast.error("A loja está fechada no momento.");
        navigate('/menu');
      } else if (cartItems.length === 0) {
        toast.error("Seu carrinho está vazio!");
        navigate('/menu');
      }
    }
  }, [settings.isStoreOpen, cartItems, loadingSettings, navigate]);

  const itemsSubtotal = cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  const deliveryFee = settings.deliveryFee || 0;
  const grandTotal = itemsSubtotal + deliveryFee;

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value !== 'dinheiro') {
      setPrecisaTroco(false);
      setTrocoPara('');
    }
  };

  const formatOrderForWhatsApp = (orderDetails) => {
    let message = `🎉 *Novo Pedido Vibe Açaí!* 🎉\n\n`;
    message += `*Cliente:* ${orderDetails.customerName}\n*Telefone:* ${orderDetails.phone}\n*Endereço:* ${orderDetails.address}\n\n*Itens do Pedido:*\n`;
    orderDetails.items.forEach(item => {
      message += `  - ${item.quantity}x ${item.name}`;
      if (item.selectedToppings && item.selectedToppings.length > 0) {
        message += ` (Adicionais: ${item.selectedToppings.map(t => t.name).join(', ')})`;
      }
      message += ` - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
    });
    message += `\n*Subtotal dos Itens:* R$ ${orderDetails.itemsSubtotal.toFixed(2).replace('.', ',')}\n`;
    if (orderDetails.deliveryFee > 0) {
      message += `*Taxa de Entrega:* R$ ${orderDetails.deliveryFee.toFixed(2).replace('.', ',')}\n`;
    }
    message += `*Total do Pedido:* R$ ${orderDetails.grandTotal.toFixed(2).replace('.', ',')}\n\n*Forma de Pagamento:* ${orderDetails.paymentMethodFormatted}\n`;
    if (orderDetails.paymentMethod === 'pix' && settings.pixKey) {
      message += `(Chave PIX para pagamento: ${settings.pixKey})\n`;
    }
    message += `\nObrigado pela preferência! 😊`;
    return encodeURIComponent(message);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!customerName || !address || !phone) {
      toast.error('Por favor, preencha todos os seus dados.');
      setIsSubmitting(false);
      return;
    }
    if (!paymentMethod) {
      toast.error('Por favor, selecione uma forma de pagamento.');
      setIsSubmitting(false);
      return;
    }
    if (paymentMethod === 'dinheiro' && precisaTroco && !trocoPara) {
      toast.error('Por favor, informe para quanto precisa de troco.');
      setIsSubmitting(false);
      return;
    }
    if (paymentMethod === 'pix' && !settings.pixKey) {
      toast.error('A forma de pagamento PIX não está disponível no momento.');
      setIsSubmitting(false);
      return;
    }
    if (!settings.whatsapp) {
      toast.error('Não foi possível enviar o pedido. O número da loja não está configurado.');
      console.error("Erro: Número de WhatsApp não encontrado nas configurações.");
      setIsSubmitting(false);
      return;
    }

    let paymentMethodFormatted = '';
    if (paymentMethod === 'dinheiro') {
      paymentMethodFormatted = `Dinheiro${precisaTroco ? ` (Troco para R$ ${parseFloat(trocoPara || 0).toFixed(2).replace('.', ',')})` : ` (Não precisa de troco)`}`;
    } else if (paymentMethod === 'cartao') {
      paymentMethodFormatted = 'Cartão (Maquininha na entrega)';
    } else if (paymentMethod === 'pix') {
      paymentMethodFormatted = 'PIX';
    }

    const orderDetailsForFirestore = {
      customerName, address, phone, paymentMethod, paymentMethodFormatted, precisaTroco,
      trocoPara: precisaTroco ? parseFloat(trocoPara || 0).toFixed(2).replace('.', ',') : '',
      items: cartItems.map(item => ({
        id: item.id,
        id_cart: item.id_cart || null,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize || null,
        selectedToppings: (item.selectedToppings && item.selectedToppings.length > 0) ? item.selectedToppings.map(t => ({ name: t.name, price: t.price })) : [],
      })),
      itemsSubtotal, deliveryFee, grandTotal,
      status: "Pendente", createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "orders"), orderDetailsForFirestore);
      const whatsappMessage = formatOrderForWhatsApp(orderDetailsForFirestore);
      const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`;
      
      window.open(whatsappLink, '_blank');
      clearCart();
      toast.success('Pedido enviado e registrado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      toast.error("Houve um erro ao processar seu pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSettings || (cartItems.length === 0 && !loadingSettings)) {
    return <LoadingText>Carregando...</LoadingText>;
  }

  return (
    <CheckoutPageWrapper>
      <Title>Finalizar Pedido</Title>
      <form onSubmit={handleSubmitOrder}>
        <FormSection>
          <h2>Seus Dados</h2>
          <FormGroup>
            <label htmlFor="customerName">Nome Completo:</label>
            <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <label htmlFor="address">Endereço Completo (Rua, N°, Bairro):</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <label htmlFor="phone">Telefone (com DDD):</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(XX) XXXXX-XXXX" required />
          </FormGroup>
        </FormSection>

        <FormSection>
          <h2>Resumo do Pedido</h2>
          <OrderSummary>
            <ul>
              {cartItems.map(item => (
                <li key={item.id_cart || item.id}>
                  <span>{item.name} (x{item.quantity})</span>
                  <strong>R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2).replace('.', ',')}</strong>
                </li>
              ))}
            </ul>
            <div className="summary-line">
              <span>Subtotal dos Itens:</span>
              <strong>R$ {itemsSubtotal.toFixed(2).replace('.', ',')}</strong>
            </div>
            {deliveryFee > 0 && (
              <div className="summary-line">
                <span>Taxa de Entrega:</span>
                <strong>R$ {deliveryFee.toFixed(2).replace('.', ',')}</strong>
              </div>
            )}
            <div className="grand-total">
              <span>Total Geral:</span>
              <strong>R$ {grandTotal.toFixed(2).replace('.', ',')}</strong>
            </div>
          </OrderSummary>
        </FormSection>

        <FormSection>
          <h2>Forma de Pagamento</h2>
          <PaymentOptionsContainer>
            <PaymentOptionLabel className={paymentMethod === 'dinheiro' ? 'selected' : ''}>
              <input type="radio" name="paymentMethod" value="dinheiro" checked={paymentMethod === 'dinheiro'} onChange={handlePaymentMethodChange} />
              Dinheiro
            </PaymentOptionLabel>
            {paymentMethod === 'dinheiro' && (
              <ConditionalInputWrapper>
                <FormGroup style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" checked={precisaTroco} onChange={(e) => setPrecisaTroco(e.target.checked)} style={{ width: 'auto' }} />
                    Precisa de troco?
                  </label>
                </FormGroup>
                {precisaTroco && (
                  <FormGroup>
                    <label htmlFor="trocoPara">Troco para quanto?</label>
                    <input type="number" id="trocoPara" value={trocoPara} onChange={(e) => setTrocoPara(e.target.value)} placeholder="Ex: 50" min="0" step="0.01" />
                  </FormGroup>
                )}
              </ConditionalInputWrapper>
            )}
            <PaymentOptionLabel className={paymentMethod === 'cartao' ? 'selected' : ''}>
              <input type="radio" name="paymentMethod" value="cartao" checked={paymentMethod === 'cartao'} onChange={handlePaymentMethodChange} />
              Cartão (Crédito/Débito na entrega)
            </PaymentOptionLabel>
            <PaymentOptionLabel className={paymentMethod === 'pix' ? 'selected' : ''}>
              <input type="radio" name="paymentMethod" value="pix" checked={paymentMethod === 'pix'} onChange={handlePaymentMethodChange} />
              PIX
            </PaymentOptionLabel>
            {paymentMethod === 'pix' && (
              <PixKeyDisplay>
                {loadingSettings ? (
                  <p>Carregando...</p>
                ) : settings.pixKey ? (
                  <>
                    <p>Realize o pagamento para a chave PIX abaixo e envie o comprovante no WhatsApp:</p>
                    <p><strong>{settings.pixKey}</strong></p>
                  </>
                ) : (
                  <p>Pagamento PIX indisponível no momento.</p>
                )}
              </PixKeyDisplay>
            )}
          </PaymentOptionsContainer>
        </FormSection>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Button type="submit" disabled={isSubmitting || !settings.isStoreOpen}>
            {isSubmitting ? 'Enviando...' : (settings.isStoreOpen ? 'Enviar Pedido para WhatsApp' : 'Loja Fechada')}
          </Button>
        </div>
      </form>
    </CheckoutPageWrapper>
  );
};

export default CheckoutPage;