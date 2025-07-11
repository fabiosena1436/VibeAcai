import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebaseConfig';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { FaPrint, FaRegCommentDots } from 'react-icons/fa'; // Ícone novo
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'; // Componente novo
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Componentes estilizados
import {
  PageWrapper,
  SectionTitle,
  LoadingText,
  ReportsSection,
  MobileCardList,
  DesktopDataGrid,
  OrderCard,
  CardHeader,
  CustomerInfo,
  OrderTotal,
  StatusSelector,
  CardActionsContainer,
  // --- NOVOS ---
  ObservationSection,
  DetailPanelWrapper 
} from './styles';

// --- NOVO --- Componente para o painel de detalhes do DataGrid
const OrderDetailPanel = ({ row }) => {
  return (
    <DetailPanelWrapper>
      <h4>Itens do Pedido:</h4>
      <ul>
        {row.items.map(item => (
          <li key={item.id_cart || item.id}>
            {item.quantity}x {item.name}
            {item.selectedToppings && item.selectedToppings.length > 0 && (
              <em> - Adicionais: {item.selectedToppings.map(t => t.name).join(', ')}</em>
            )}
          </li>
        ))}
      </ul>
      {row.observations && (
        <div className="observations">
          <h4>Observações do Cliente:</h4>
          <p>{row.observations}</p>
        </div>
      )}
    </DetailPanelWrapper>
  );
};

const DashboardOverviewPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesToday, setSalesToday] = useState(0);
  const [ordersTodayCount, setOrdersTodayCount] = useState(0);
  const [salesThisWeek, setSalesThisWeek] = useState(0);
  const [ordersThisWeekCount, setOrdersThisWeekCount] = useState(0);
  const [salesThisMonth, setSalesThisMonth] = useState(0);
  const [ordersThisMonthCount, setOrdersThisMonthCount] = useState(0);
  const [salesThisYear, setSalesThisYear] = useState(0);
  const [ordersThisYearCount, setOrdersThisYearCount] = useState(0);
  const [selectedStatusTab, setSelectedStatusTab] = useState('Ativos');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersCollectionRef = collection(db, 'orders');
      const q = query(ordersCollectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setOrders(ordersData);

      let todaySales = 0, todayCount = 0, weekSales = 0, weekCount = 0, monthSales = 0, monthCount = 0, yearSales = 0, yearCount = 0;
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      
      ordersData.forEach(order => {
        if (order.createdAt?.toDate) {
          const orderDate = order.createdAt.toDate();
          const orderTotal = order.grandTotal || 0;
          if (orderDate >= startOfToday) { todaySales += orderTotal; todayCount++; }
          if (orderDate >= startOfWeek) { weekSales += orderTotal; weekCount++; }
          if (orderDate >= startOfMonth) { monthSales += orderTotal; monthCount++; }
          if (orderDate >= startOfYear) { yearSales += orderTotal; yearCount++; }
        }
      });

      setSalesToday(todaySales); setOrdersTodayCount(todayCount);
      setSalesThisWeek(weekSales); setOrdersThisWeekCount(weekCount);
      setSalesThisMonth(monthSales); setOrdersThisMonthCount(monthCount);
      setSalesThisYear(yearSales); setOrdersThisYearCount(yearCount);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const sendWhatsAppNotification = (phone, customerName, orderId) => {
    const cleanedPhone = phone.replace(/\D/g, '');
    const message = `Olá, ${customerName}! Seu pedido #${orderId.substring(0, 5)} da Vibe Açaí saiu para entrega e chegará em breve! 🛵`;
    const whatsappLink = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappLink, '_blank');
    toast.success(`Notificação para ${customerName} pronta para envio!`);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const orderDocRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderDocRef, { status: newStatus });
      toast.success("Status do pedido atualizado!");

      if (newStatus === 'Saiu para Entrega') {
        const order = orders.find(o => o.id === orderId);
        if (order && order.phone) {
          sendWhatsAppNotification(order.phone, order.customerName, order.id);
        } else {
          toast.error("Cliente não possui telefone para notificar.");
        }
      }
      fetchData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Falha ao atualizar o status.");
    }
  };

  const handlePrintOrder = (orderId) => {
    window.open(`/admin/print/order/${orderId}`, '_blank');
  };

  const columns = [
    { field: 'createdAt', headerName: 'Data', width: 170, valueGetter: (params) => params.row?.createdAt?.toDate() || null, renderCell: (params) => params.value ? params.value.toLocaleString('pt-BR') : 'N/A' },
    { field: 'customerName', headerName: 'Cliente', width: 200, flex: 1 },
    // --- NOVO --- Coluna para indicar observações
    { 
      field: 'observations', 
      headerName: 'Obs.', 
      width: 80, 
      renderCell: (params) => (
        params.value ? <FaRegCommentDots color="#7c3aed" title={`Observação: ${params.value}`} /> : 'Não'
      )
    },
    { field: 'grandTotal', headerName: 'Total', width: 130, type: 'number', renderCell: (params) => `R$ ${params.value?.toFixed(2).replace('.', ',') || '0,00'}` },
    {
      field: 'status', headerName: 'Status', width: 180,
      renderCell: (params) => (
        <StatusSelector
          value={params.value}
          onChange={(e) => handleUpdateOrderStatus(params.row.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="Pendente">Pendente</option>
          <option value="Em Preparo">Em Preparo</option>
          <option value="Saiu para Entrega">Saiu para Entrega</option>
          <option value="Concluído">Concluído</option>
          <option value="Cancelado">Cancelado</option>
        </StatusSelector>
      )
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={(e) => { e.stopPropagation(); handlePrintOrder(params.row.id); }}
          style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#7c3aed', padding: '10px' }}
          aria-label="Imprimir Recibo"
        >
          <FaPrint size={20} />
        </button>
      ),
    },
    { field: 'id', headerName: 'ID Pedido', width: 150, renderCell: (params) => params.value.substring(0, 8) + '...' },
  ];

  const handleTabChange = (event, newValue) => { setSelectedStatusTab(newValue); };

  const filteredOrders = orders.filter(order => {
    if (selectedStatusTab === 'Todos') return true;
    if (selectedStatusTab === 'Ativos') return ['Pendente', 'Em Preparo', 'Saiu para Entrega'].includes(order.status);
    return order.status === selectedStatusTab;
  });

  return (
    <PageWrapper>
      <h1>Visão Geral do Dashboard</h1>
      <SectionTitle>Relatórios Rápidos</SectionTitle>
      {loading ? (<LoadingText>Calculando relatórios...</LoadingText>) : (
        <ReportsSection>
          <h3>Resumo de Vendas</h3>
          <div><h4>Hoje ({new Date().toLocaleDateString('pt-BR')})</h4><p>Total de Vendas: <strong>R$ {salesToday.toFixed(2).replace('.', ',')}</strong></p><p>Número de Pedidos: <strong>{ordersTodayCount}</strong></p></div>
          <div><h4>Esta Semana</h4><p>Total de Vendas: <strong>R$ {salesThisWeek.toFixed(2).replace('.', ',')}</strong></p><p>Número de Pedidos: <strong>{ordersThisWeekCount}</strong></p></div>
          <div><h4>Este Mês ({new Date().toLocaleString('pt-BR', { month: 'long' })})</h4><p>Total de Vendas: <strong>R$ {salesThisMonth.toFixed(2).replace('.', ',')}</strong></p><p>Número de Pedidos: <strong>{ordersThisMonthCount}</strong></p></div>
          <div><h4>Este Ano ({new Date().getFullYear()})</h4><p>Total de Vendas: <strong>R$ {salesThisYear.toFixed(2).replace('.', ',')}</strong></p><p>Número de Pedidos: <strong>{ordersThisYearCount}</strong></p></div>
        </ReportsSection>
      )}

      <SectionTitle>Pedidos</SectionTitle>
      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1, overflow: 'hidden' }}>
        <Tabs
          value={selectedStatusTab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
          allowScrollButtonsMobile
          centered={!isMobile}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`Ativos (${orders.filter(o => ['Pendente', 'Em Preparo', 'Saiu para Entrega'].includes(o.status)).length})`} value="Ativos" />
          <Tab label={`Concluídos (${orders.filter(o => o.status === 'Concluído').length})`} value="Concluído" />
          <Tab label={`Cancelados (${orders.filter(o => o.status === 'Cancelado').length})`} value="Cancelado" />
          <Tab label={`Todos (${orders.length})`} value="Todos" />
        </Tabs>

        <DesktopDataGrid>
          <Box sx={{ height: 600, width: '100%', overflow: 'hidden' }}>
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              // --- NOVO --- Prop para mostrar o painel de detalhes
              getDetailPanelContent={({ row }) => <OrderDetailPanel row={row} />}
              initialState={{ columns: { columnVisibilityModel: { id: false } } }}
              pageSizeOptions={[5, 10, 20]}
              loading={loading}
              localeText={{ noRowsLabel: 'Nenhum pedido para exibir nesta categoria' }}
            />
          </Box>
        </DesktopDataGrid>

        <MobileCardList>
          {loading ? <LoadingText>Carregando pedidos...</LoadingText> : (
            filteredOrders.length > 0 ? filteredOrders.map(order => (
              <OrderCard key={order.id}>
                <CardHeader>
                  <CustomerInfo><h4>{order.customerName}</h4><span>{order.createdAt?.toDate().toLocaleString('pt-BR') || 'Data indisponível'}</span></CustomerInfo>
                  <OrderTotal>R$ {order.grandTotal?.toFixed(2).replace('.', ',') || '0,00'}</OrderTotal>
                </CardHeader>
                
                {/* --- NOVO --- Seção para mostrar as observações no mobile */}
                {order.observations && (
                  <ObservationSection>
                    <strong>Observações:</strong>
                    <p>{order.observations}</p>
                  </ObservationSection>
                )}

                <CardActionsContainer>
                  <StatusSelector value={order.status} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}>
                    <option value="Pendente">Pendente</option>
                    <option value="Em Preparo">Em Preparo</option>
                    <option value="Saiu para Entrega">Saiu para Entrega</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                  </StatusSelector>
                  <button onClick={() => handlePrintOrder(order.id)} className="print-button"><FaPrint size={18} /></button>
                </CardActionsContainer>
              </OrderCard>
            )) : <LoadingText>Nenhum pedido para exibir nesta categoria</LoadingText>
          )}
        </MobileCardList>
      </Box>
    </PageWrapper>
  );
};

export default DashboardOverviewPage;