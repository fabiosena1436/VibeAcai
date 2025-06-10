// src/pages/Admin/SettingsPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import ConfirmationModal from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// --- STYLED COMPONENTS COM RESPONSIVIDADE ---
const PageWrapper = styled.div`
  h1 { font-size: 2em; color: #333; margin-bottom: 30px; }
`;

const SectionTitle = styled.h2`
  font-size: 1.5em; color: #555; margin-top: 0; margin-bottom: 20px; 
  border-bottom: 1px solid #ddd; padding-bottom: 10px; 
  &:not(:first-child){ margin-top: 40px; }
`;

const Form = styled.form` /* Renomeado de AddForm para Form para uso mais genérico */
  background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 10px; 
  display: flex; flex-direction: column; gap: 15px; border: 1px solid #eee;
  /* Garante que o formulário ocupe toda a altura do seu container de grid */
  height: 100%; 
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; 
  label { margin-bottom: 5px; font-weight: 600; color: #444; } 
  input, textarea { 
    padding: 10px; border: 1px solid #ccc; border-radius: 6px; 
    font-size: 1em; background-color: white; 
  }
  textarea { min-height: 100px; resize: vertical; }
  p { font-size: 0.9em; margin-top: 5px; color: #666; }
  img {
    max-width: 100%; /* Imagem se ajusta à largura do container */
    height: auto;
    margin-top: 10px; border-radius: 8px; border: 1px solid #ddd;
  }
`;

const LoadingText = styled.p`text-align: center; color: #555; font-style: italic; margin-top: 20px;`;

const StatusDisplay = styled.div`
  margin-bottom: 10px; font-size: 1.1em; font-weight: bold;
  color: ${props => props.isOpen ? '#16a34a' : '#b91c1c'};
`;

const SettingsBlock = styled.div`
  padding: 20px; background-color: #f9f9f9;
  border-radius: 8px; border: 1px solid #eee;
`;

// Novo container para organizar os forms de identidade visual
const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* 1 coluna por padrão (mobile) */
  gap: 20px;
  margin-bottom: 40px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr; /* 2 colunas para desktop */
  }
`;
// --- FIM DOS STYLED COMPONENTS ---

const STORE_SETTINGS_DOC_ID = "mainConfig";

const SettingsPage = () => {
  const [pixKey, setPixKey] = useState('');
  const [newPixKeyInput, setNewPixKeyInput] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [newDeliveryFeeInput, setNewDeliveryFeeInput] = useState('');
  const [openingHoursText, setOpeningHoursText] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const fetchStoreSettings = async () => {
      setLoadingSettings(true);
      try {
        const settingsDocRef = doc(db, 'storeSettings', STORE_SETTINGS_DOC_ID);
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists()) {
          const d = docSnap.data();
          setPixKey(d.pixKey || ''); setNewPixKeyInput(d.pixKey || '');
          setDeliveryFee(d.deliveryFee ?? 0); setNewDeliveryFeeInput(d.deliveryFee?.toString() ?? '0');
          setIsStoreOpen(d.isStoreOpen !== undefined ? d.isStoreOpen : true);
          setOpeningHoursText(d.openingHoursText || '');
          setLogoUrl(d.logoUrl || '');
          setBannerUrl(d.bannerUrl || '');
        } else {
          console.log("Documento de configurações não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        toast.error("Não foi possível carregar as configurações.");
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchStoreSettings();
  }, []);

  const handleUpdateSetting = async (dataToUpdate, successMessage) => {
    setIsSubmitting(true);
    try {
      const settingsDocRef = doc(db, 'storeSettings', STORE_SETTINGS_DOC_ID);
      await setDoc(settingsDocRef, dataToUpdate, { merge: true });
      toast.success(successMessage || 'Configurações atualizadas!');
      
      if (dataToUpdate.pixKey !== undefined) setPixKey(dataToUpdate.pixKey);
      if (dataToUpdate.deliveryFee !== undefined) {
        setDeliveryFee(dataToUpdate.deliveryFee);
        setNewDeliveryFeeInput(dataToUpdate.deliveryFee.toString());
      }
      if (dataToUpdate.openingHoursText !== undefined) setOpeningHoursText(dataToUpdate.openingHoursText);
      if (dataToUpdate.isStoreOpen !== undefined) setIsStoreOpen(dataToUpdate.isStoreOpen);
      if (dataToUpdate.logoUrl !== undefined) setLogoUrl(dataToUpdate.logoUrl);
      if (dataToUpdate.bannerUrl !== undefined) setBannerUrl(dataToUpdate.bannerUrl);

    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
      toast.error("Falha ao atualizar configuração.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmRemovePixKey = async () => {
    await handleUpdateSetting({ pixKey: "" }, 'Chave PIX removida!');
    setNewPixKeyInput('');
    setIsConfirmModalOpen(false);
  };
  
  const handleUpdatePixKey = (e) => {
    e.preventDefault();
    if (!newPixKeyInput.trim() && pixKey) {
      setIsConfirmModalOpen(true);
      return;
    }
    handleUpdateSetting({ pixKey: newPixKeyInput.trim() }, 'Chave PIX atualizada!');
  };
  
  const handleUpdateDeliveryFee = (e) => {
    e.preventDefault();
    const feeValue = parseFloat(newDeliveryFeeInput);
    if (isNaN(feeValue) || feeValue < 0) {
      toast.error('Valor inválido para taxa.'); return;
    }
    handleUpdateSetting({ deliveryFee: feeValue }, 'Taxa de entrega atualizada!');
  };

  const handleToggleStoreStatus = () => {
    const newStatus = !isStoreOpen;
    handleUpdateSetting({ isStoreOpen: newStatus }, `Loja marcada como ${newStatus ? 'ABERTA' : 'FECHADA'}.`);
  };
  
  const handleUpdateOpeningHours = (e) => {
    e.preventDefault();
    handleUpdateSetting({ openingHoursText: openingHoursText }, 'Horário de funcionamento salvo!');
  };

  const handleUpdateLogo = (e) => {
    e.preventDefault();
    handleUpdateSetting({ logoUrl: logoUrl.trim() }, 'URL da Logo salva!');
  };

  const handleUpdateBanner = (e) => {
    e.preventDefault();
    handleUpdateSetting({ bannerUrl: bannerUrl.trim() }, 'URL do Banner salvo!');
  };

  return (
    <>
      <PageWrapper>
        <h1>Configurações da Loja</h1>

        <SectionTitle>Status e Horários</SectionTitle>
        <SettingsBlock>
          <StatusDisplay isOpen={isStoreOpen}>
            Status Atual da Loja: {isStoreOpen ? 'ABERTA' : 'FECHADA'}
          </StatusDisplay>
          <p style={{fontSize: '0.9em', color: '#666', marginTop: '5px'}}>Quando a loja está fechada, os clientes não podem finalizar pedidos.</p>
          <Button onClick={handleToggleStoreStatus} style={{backgroundColor: isStoreOpen ? '#f59e0b' : '#22c55e', marginTop: '10px'}} disabled={isSubmitting}>
            {isStoreOpen ? 'FECHAR LOJA' : 'ABRIR LOJA'}
          </Button>
          <hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid #ddd'}} />
          <Form onSubmit={handleUpdateOpeningHours} style={{margin: 0, padding: 0, border: 'none', backgroundColor: 'transparent', boxShadow: 'none'}}>
            <FormGroup>
              <label htmlFor="hoursText">Texto de Horário de Funcionamento (visível para o cliente):</label>
              <textarea id="hoursText" value={openingHoursText} onChange={(e) => setOpeningHoursText(e.target.value)} placeholder="Ex: Seg a Sex: 18h - 23h&#10;Sáb e Dom: 18h - 00h" />
            </FormGroup>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Horário'}</Button>
          </Form>
        </SettingsBlock>

        <SectionTitle>Identidade Visual</SectionTitle>
        <SettingsGrid>
          <Form onSubmit={handleUpdateLogo}>
            <FormGroup>
              <label htmlFor="logoUrl">URL da Logo:</label>
              <input type="text" id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://servidor.com/sua-logo.png"/>
              {logoUrl && <img src={logoUrl} alt="Pré-visualização do logo" />}
            </FormGroup>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Logo'}</Button>
          </Form>
          <Form onSubmit={handleUpdateBanner}>
            <FormGroup>
              <label htmlFor="bannerUrl">URL do Banner da Página Inicial:</label>
              <input type="text" id="bannerUrl" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://servidor.com/seu-banner.jpg"/>
              {bannerUrl && <img src={bannerUrl} alt="Pré-visualização do banner" />}
            </FormGroup>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Banner'}</Button>
          </Form>
        </SettingsGrid>

        <SectionTitle>Pagamento e Entrega</SectionTitle>
        <SettingsGrid>
          <Form onSubmit={handleUpdatePixKey}>
            <FormGroup>
              <label htmlFor="pixKeyInput">Chave PIX:</label>
              <input type="text" id="pixKeyInput" value={newPixKeyInput} onChange={(e) => setNewPixKeyInput(e.target.value)} placeholder="Sua chave PIX" />
              {loadingSettings ? (<LoadingText>Carregando...</LoadingText>) : pixKey ? (<p>Atual: <strong>{pixKey}</strong></p>) : (<p>Nenhuma chave PIX configurada.</p>)}
            </FormGroup>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Chave PIX'}</Button>
          </Form>
          <Form onSubmit={handleUpdateDeliveryFee}>
            <FormGroup>
              <label htmlFor="deliveryFeeInput">Taxa de Entrega (R$):</label>
              <input type="number" id="deliveryFeeInput" value={newDeliveryFeeInput} onChange={(e) => setNewDeliveryFeeInput(e.target.value)} placeholder="Ex: 5.00" step="0.01" min="0" />
              {loadingSettings ? (<LoadingText>Carregando...</LoadingText>) : (<p>Taxa Atual: <strong>R$ {deliveryFee.toFixed(2).replace('.', ',')}</strong></p>)}
            </FormGroup>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Taxa de Entrega'}</Button>
          </Form>
        </SettingsGrid>
      </PageWrapper>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmRemovePixKey}
        title="Remover Chave PIX"
        message="Você deixou o campo da Chave PIX vazio. Deseja remover a chave existente?"
      />
    </>
  );
};

export default SettingsPage;