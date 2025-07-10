import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import { useStoreSettings } from '../../../contexts/StoreSettingsContext';

import {
  PrintStyles,
  ReceiptWrapper,
  Header,
  LogoImage,
  Title,
  StoreInfo,
  Section,
  SectionTitle,
  InfoRow,
  ItemsList,
  Item,
  ItemName,
  ItemPrice,
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

  const needsChange = order.paymentMethod === 'dinheiro' && order.trocoPara && parseFloat(order.trocoPara) > 0;
  const changeValue = needsChange ? parseFloat(order.trocoPara) - order.grandTotal : 0;

  return (
    <>
      <PrintStyles />
      {/* A ÚNICA MUDANÇA É A ADIÇÃO DA CLASSNAME ABAIXO */}
      <ReceiptWrapper className="printable-receipt"> 
        <Header>
          {settings.logoUrl && <LogoImage src={settings.logoUrl} alt="Logo da loja" />}
          <Title>{settings.storeName || 'Vibe Açaí'}</Title>
          {settings.address && <StoreInfo>{settings.address}</StoreInfo>}
        </Header>
        
        <DottedLine />
        <Section>
          <InfoRow><span>Pedido:</span> <span>#{order.id.substring(0, 8).toUpperCase()}</span></InfoRow>
          <InfoRow><span>Data:</span> <span>{order.createdAt?.toDate().toLocaleString('pt-BR')}</span></InfoRow>
        </Section>
        <DottedLine />

        <Section>
          <SectionTitle>ENTREGAR PARA:</SectionTitle>
          <p>{order.customerName.toUpperCase()}</p>
          <p>{order.address}</p>
          <p>Telefone: {order.phone}</p>
        </Section>
        <DottedLine />

        <Section>
          <SectionTitle>ITENS DO PEDIDO</SectionTitle>
          <ItemsList>
            {order.items.map((item) => (
              <Item key={item.id_cart || item.id}>
                <ItemName>{item.quantity}x {item.name}</ItemName>
                <ItemPrice>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</ItemPrice>
              </Item>
            ))}
          </ItemsList>
        </Section>
        <DottedLine />

        <Footer>
          <InfoRow><span>Subtotal:</span> <span>R$ {order.itemsSubtotal.toFixed(2).replace('.', ',')}</span></InfoRow>
          <InfoRow><span>Taxa de Entrega:</span> <span>R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</span></InfoRow>
          <InfoRow className="grand-total"><span>TOTAL:</span> <span>R$ {order.grandTotal.toFixed(2).replace('.', ',')}</span></InfoRow>
          <DottedLine />
          <InfoRow><span>Pagamento:</span> <span>{order.paymentMethodFormatted}</span></InfoRow>
          {needsChange && (
            <>
              <InfoRow><span>Pagar com:</span> <span>R$ {parseFloat(order.trocoPara).toFixed(2).replace('.', ',')}</span></InfoRow>
              <InfoRow className="change"><span>TROCO:</span> <span>R$ {changeValue.toFixed(2).replace('.', ',')}</span></InfoRow>
            </>
          )}
        </Footer>
        
        <ThankYouMessage>Obrigado pela preferência!</ThankYouMessage>

        <div className="no-print">
          <PrintButton onClick={() => window.print()}>Imprimir Novamente</PrintButton>
        </div>
      </ReceiptWrapper>
    </>
  );
};

export default PrintableReceiptPage;