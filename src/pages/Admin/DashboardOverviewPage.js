// src/pages/Admin/DashboardOverviewPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';

// Importações do MUI para a Tabela e Abas
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// --- STYLED COMPONENTS COM RESPONSIVIDADE ---
const PageWrapper = styled.div`
  h1 {
    font-size: 2em;
    color: #333;
    margin-bottom: 30px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5em; 
  color: #555; 
  margin-top: 0; 
  margin-bottom: 20px; 
  border-bottom: 1px solid #ddd; 
  padding-bottom: 10px; 
  
  &:not(:first-child) { 
    margin-top: 40px; 
  }
`;

const LoadingText = styled.p`
  text-align: center; 
  color: #555; 
  font-style: italic; 
  margin-top: 20px;
`;

const ReportsSection = styled.div`
  background-color: #fff; 
  padding: 20px; 
  border-radius: 8px; 
  margin-bottom: 40px; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.07);
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 20px 40px; 

  h3 { 
    margin-top: 0; 
    color: #555; 
    font-size: 1.2em; 
    margin-bottom: 15px; 
    grid-column: 1 / -1; 
  }

  div { 
    padding-top: 15px; 
    border-top: 1px solid #eee; 
  } 

  p { 
    font-size: 1.1em; 
    color: #333; 
    margin: 10px 0; 
    strong { color: #7c3aed; } 
  }

  /* Em telas menores, os cartões de relatório ficam em uma única coluna */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
`;

// Wrapper para aplicar estilos responsivos na tabela
const DataGridWrapper = styled.div`
  .MuiDataGrid-root {
    border: none; /* Remove borda dupla */
  }

  /* Em telas menores, oculta a coluna de ID */
  @media (max-width: 768px) {
    .column-id {
      display: none;
    }
  }
`;
// --- FIM DOS STYLED COMPONENTS ---


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
  
  // Hooks do MUI para responsividade das Abas
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
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const orderDocRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderDocRef, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      alert("Falha ao atualizar o status do pedido.");
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID Pedido', width: 150, cellClassName: 'column-id', headerClassName: 'column-id', renderCell: (params) => params.value.substring(0,8) + '...' },
    { field: 'createdAt', headerName: 'Data', width: 170, valueGetter: (params) => params.row?.createdAt?.toDate() || null, renderCell: (params) => params.value ? params.value.toLocaleString('pt-BR') : 'N/A' },
    { field: 'customerName', headerName: 'Cliente', width: 200, flex: 1 },
    { field: 'grandTotal', headerName: 'Total', width: 130, type: 'number', renderCell: (params) => `R$ ${params.value?.toFixed(2).replace('.', ',') || '0,00'}` },
    { field: 'status', headerName: 'Status', width: 180,
      renderCell: (params) => (
        <select 
          value={params.value}
          onChange={(e) => handleUpdateOrderStatus(params.row.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}
        >
          <option value="Pendente">Pendente</option>
          <option value="Em Preparo">Em Preparo</option>
          <option value="Saiu para Entrega">Saiu para Entrega</option>
          <option value="Concluído">Concluído</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      )
    },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedStatusTab(newValue);
  };

  const filteredOrders = orders.filter(order => {
    if (selectedStatusTab === 'Todos') return true;
    if (selectedStatusTab === 'Ativos') return ['Pendente', 'Em Preparo', 'Saiu para Entrega'].includes(order.status);
    return order.status === selectedStatusTab;
  });

  return (
    <PageWrapper>
      <h1>Visão Geral do Dashboard</h1>
      
      <SectionTitle>Relatórios Rápidos</SectionTitle>
      {loading ? ( <LoadingText>Calculando relatórios...</LoadingText> ) : (<ReportsSection>
        <h3>Resumo de Vendas</h3>
        <div><h4>Hoje ({new Date().toLocaleDateString('pt-BR')})</h4><p>Total de Vendas: <strong>R$ {salesToday.toFixed(2).replace('.', ',')}</strong></p><p>Número de Pedidos: <strong>{ordersTodayCount}</strong></p></div>
        <div><h4>Esta Semana</h4><p>Total de Vendas: <strong>R$ {salesThisWeek.toFixed(2).replace('.', ',')}</strong></p><p>Número de Pedidos: <strong>{ordersThisWeekCount}</strong></p></div>
        <div><h4>Este Mês ({new Date().toLocaleString('pt-BR', { month: 'long' })})</h4><p>Total de Vendas: <strong>R$ {salesThisMonth.toFixed(2).replace('.', ',')}</strong></p><p>Número de Pedidos: <strong>{ordersThisMonthCount}</strong></p></div>
        <div><h4>Este Ano ({new Date().getFullYear()})</h4><p>Total de Vendas: <strong>R$ {salesThisYear.toFixed(2).replace('.', ',')}</strong></p><p>Número de Pedidos: <strong>{ordersThisYearCount}</strong></p></div>
      </ReportsSection>)}
      
      <SectionTitle>Pedidos</SectionTitle>
      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1, overflow: 'hidden' }}>
        <Tabs 
            value={selectedStatusTab} 
            onChange={handleTabChange} 
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            allowScrollButtonsMobile
            centered={!isMobile}
        >
          <Tab label={`Ativos (${orders.filter(o => ['Pendente', 'Em Preparo', 'Saiu para Entrega'].includes(o.status)).length})`} value="Ativos" />
          <Tab label={`Concluídos (${orders.filter(o => o.status === 'Concluído').length})`} value="Concluído" />
          <Tab label={`Cancelados (${orders.filter(o => o.status === 'Cancelado').length})`} value="Cancelado" />
          <Tab label={`Todos (${orders.length})`} value="Todos" />
        </Tabs>
        <DataGridWrapper>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              loading={loading}
              localeText={{ noRowsLabel: 'Nenhum pedido para exibir nesta categoria' }}
            />
          </Box>
        </DataGridWrapper>
      </Box>
    </PageWrapper>
  );
};

export default DashboardOverviewPage;