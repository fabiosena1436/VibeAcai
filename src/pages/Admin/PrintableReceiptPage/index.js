import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import { useStoreSettings } from '../../../contexts/StoreSettingsContext'; // Importando o hook de configurações

import {
  ReceiptWrapper,
  Header,
  LogoImage,
  Title,
  StoreAddress,
  InfoSection,
  InfoRow,
  ItemsSection,
  ItemsList,
  Item,
  ItemName,
  ItemPrice,
  ToppingsList,
  UnitPrice,
  Footer,
  LoadingText,
  PrintButton,
  ThankYouMessage,
  DottedLine,
} from './styles';

const PrintableReceiptPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Usando o hook para pegar as configurações da loja
  const { settings, loading: loadingSettings } = useStoreSettings();
  
  const hasPrinted = useRef(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const orderDocRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(orderDocRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Pedido não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar o pedido:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    // Imprime automaticamente apenas quando o pedido e as configurações estiverem carregados
    if (order && !loadingSettings && !hasPrinted.current) {
      window.print();
      hasPrinted.current = true;
    }
  }, [order, loadingSettings]);

  if (loading || loadingSettings) {
    return <LoadingText>Carregando dados do pedido...</LoadingText>;
  }

  if (!order) {
    return <LoadingText>Pedido não encontrado.</LoadingText>;
  }

  // --- Lógica para calcular o troco ---
  const needsChange = order.paymentMethod === 'dinheiro' && order.trocoPara && parseFloat(order.trocoPara) > 0;
  const changeValue = needsChange ? parseFloat(order.trocoPara) - order.grandTotal : 0;

  return (
    <ReceiptWrapper>
      <Header>
        {settings.logoUrl && <LogoImage src={settings.logoUrl} alt="Logo da loja" />}
        {/* Usaremos "Vibe Açaí" como padrão se o nome da loja não estiver nas configurações */}
        <Title>{settings.storeName || 'Vibe Açaí'}</Title>
        {settings.address && <StoreAddress>{settings.address}</StoreAddress>}
        <DottedLine />
        <p>Pedido: #{order.id.substring(0, 8).toUpperCase()}</p>
        <p>Data: {order.createdAt?.toDate().toLocaleString('pt-BR')}</p>
      </Header>

      <InfoSection>
        <h3>ENTREGAR PARA:</h3>
        <InfoRow><strong>{order.customerName.toUpperCase()}</strong></InfoRow>
        <InfoRow><span>{order.address}</span></InfoRow>
        <InfoRow><span>Telefone: {order.phone}</span></InfoRow>
      </InfoSection>

      <ItemsSection>
        <h3>ITENS DO PEDIDO</h3>
        <ItemsList>
          {order.items.map((item) => (
            <Item key={item.id_cart || item.id}>
              <ItemName>
                {item.quantity}x {item.name}
                {item.quantity > 1 && (
                  <UnitPrice>
                    (R$ {item.price.toFixed(2).replace('.', ',')} / un)
                  </UnitPrice>
                )}
                {item.selectedToppings && item.selectedToppings.length > 0 && (
                  <ToppingsList>
                    Adicionais: {item.selectedToppings.map(t => t.name).join(', ')}
                  </ToppingsList>
                )}
              </ItemName>
              <ItemPrice>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</ItemPrice>
            </Item>
          ))}
        </ItemsList>
      </ItemsSection>

      <Footer>
        <InfoRow>
          <span>Subtotal:</span>
          <strong>R$ {order.itemsSubtotal.toFixed(2).replace('.', ',')}</strong>
        </InfoRow>
        <InfoRow>
          <span>Taxa de Entrega:</span>
          <strong>R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</strong>
        </InfoRow>
        <InfoRow className="grand-total">
          <span>TOTAL:</span>
          <strong>R$ {order.grandTotal.toFixed(2).replace('.', ',')}</strong>
        </InfoRow>
        <DottedLine />
        <InfoRow>
          <span>Pagamento:</span>
          <strong>{order.paymentMethodFormatted}</strong>
        </InfoRow>
        {needsChange && (
          <>
            <InfoRow>
              <span>Pagar com:</span>
              <strong>R$ {parseFloat(order.trocoPara).toFixed(2).replace('.', ',')}</strong>
            </InfoRow>
            <InfoRow>
              <span>TROCO:</span>
              <strong>R$ {changeValue.toFixed(2).replace('.', ',')}</strong>
            </InfoRow>
          </>
        )}
      </Footer>
      
      <ThankYouMessage>
        Obrigado pela preferência!
      </ThankYouMessage>

      <div className="no-print">
        <PrintButton onClick={() => window.print()}>
          Imprimir Novamente
        </PrintButton>
      </div>
    </ReceiptWrapper>
  );
};

export default PrintableReceiptPage;