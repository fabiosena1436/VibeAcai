import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import {
  ReceiptWrapper,
  Header,
  Title,
  InfoSection,
  InfoRow,
  ItemsSection,
  ItemTable,
  Footer,
  LoadingText,
  PrintButton
} from './styles';

const PrintableReceiptPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
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
    if (order && !hasPrinted.current) {
      window.print();
      hasPrinted.current = true;
    }
  }, [order]);

  if (loading) {
    return <LoadingText>Carregando dados do pedido...</LoadingText>;
  }

  if (!order) {
    return <LoadingText>Pedido não encontrado.</LoadingText>;
  }

  return (
    <ReceiptWrapper>
      <Header>
        <Title>Vibe Açaí - Recibo do Pedido</Title>
        <p>ID do Pedido: {order.id.substring(0, 8)}...</p>
        <p>Data: {order.createdAt?.toDate().toLocaleString('pt-BR')}</p>
      </Header>

      <InfoSection>
        <h3>Dados do Cliente</h3>
        <InfoRow><strong>Nome:</strong> {order.customerName}</InfoRow>
        <InfoRow><strong>Telefone:</strong> {order.phone}</InfoRow>
        <InfoRow><strong>Endereço:</strong> {order.address}</InfoRow>
      </InfoSection>

      <ItemsSection>
        <h3>Itens do Pedido</h3>
        <ItemTable>
          <thead>
            <tr>
              <th>Qtd.</th>
              <th>Produto</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id_cart || item.id}>
                <td>{item.quantity}x</td>
                <td>
                  {item.name}
                  {/* --- ALTERADO --- Mostra o preço unitário se a quantidade for maior que 1 */}
                  {item.quantity > 1 && (
                    <div className="unit-price">
                      (R$ {item.price.toFixed(2).replace('.', ',')} / un)
                    </div>
                  )}
                  {item.selectedToppings && item.selectedToppings.length > 0 && (
                    <div className="toppings-list">
                      Adicionais: {item.selectedToppings.map(t => t.name).join(', ')}
                    </div>
                  )}
                </td>
                <td>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</td>
              </tr>
            ))}
          </tbody>
        </ItemTable>
      </ItemsSection>

      <Footer>
        <InfoRow>
          <span>Subtotal dos Itens:</span>
          <strong>R$ {order.itemsSubtotal.toFixed(2).replace('.', ',')}</strong>
        </InfoRow>
        <InfoRow>
          <span>Taxa de Entrega:</span>
          <strong>R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</strong>
        </InfoRow>
        <InfoRow className="grand-total">
          <span>TOTAL GERAL:</span>
          <strong>R$ {order.grandTotal.toFixed(2).replace('.', ',')}</strong>
        </InfoRow>
        <hr />
        <InfoRow>
          <span>Forma de Pagamento:</span>
          <strong>{order.paymentMethodFormatted}</strong>
        </InfoRow>
      </Footer>

      <div className="no-print">
        <PrintButton onClick={() => window.print()}>
          Imprimir novamente
        </PrintButton>
      </div>
    </ReceiptWrapper>
  );
};

export default PrintableReceiptPage;