// src/pages/Admin/DashboardOverviewPage/index.js
import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { 
  DashboardWrapper, 
  Header, 
  Title, 
  OrdersGrid, 
  OrderCard, 
  OrderHeader, 
  StatusBadge, 
  OrderBody, 
  OrderActions,
  EmptyState
} from './styles';

const DashboardOverviewPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersCollection = collection(db, 'orders');
    const activeOrdersQuery = query(
      ordersCollection, 
      where('status', 'in', ['Pendente', 'Em Preparo', 'Pronto para Retirada']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(activeOrdersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    }, (error) => {
      console.error("Erro ao buscar pedidos:", error);
      toast.error("Não foi possível carregar os pedidos.");
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const orderDocRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderDocRef, { status: newStatus });
      toast.success('Status do pedido atualizado!');
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error('Falha ao atualizar o status.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };
  
  return (
    <DashboardWrapper>
      <Header>
        <Title>Pedidos Ativos</Title>
      </Header>
      
      {orders.length > 0 ? (
        <OrdersGrid>
          {orders.map(order => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <h3>{order.customerName}</h3>
                <StatusBadge status={order.status}>{order.status}</StatusBadge>
              </OrderHeader>
              <OrderBody>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.name} ({item.size}) - {formatPrice(item.totalPrice)}
                    </li>
                  ))}
                </ul>
                <p><strong>Total do Pedido:</strong> {formatPrice(order.totalAmount)}</p>
                <p><strong>Pagamento:</strong> {order.paymentMethod}</p>
                {order.paymentMethod === 'PIX' && order.requiresChange && (
                    <p><strong>Troco para:</strong> {formatPrice(order.changeFor)}</p>
                )}
              </OrderBody>
              <OrderActions>
                <label htmlFor={`status-select-${order.id}`}>Alterar Status:</label>
                <select 
                  id={`status-select-${order.id}`}
                  value={order.status} 
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Preparo">Em Preparo</option>
                  <option value="Pronto para Retirada">Pronto para Retirada</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </OrderActions>
            </OrderCard>
          ))}
        </OrdersGrid>
      ) : (
        <EmptyState>
          <p>Nenhum pedido ativo no momento.</p>
        </EmptyState>
      )}
    </DashboardWrapper>
  );
};

export default DashboardOverviewPage;