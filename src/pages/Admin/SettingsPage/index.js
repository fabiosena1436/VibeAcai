// src/pages/Admin/SettingsPage/index.js

import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { db } from '../../../services/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Importando todos os componentes estilizados do arquivo de estilos
import {
  PageWrapper,
  SectionTitle,
  Form,
  FormGroup,
  LoadingText,
  StatusDisplay,
  SettingsBlock,
  SettingsGrid
} from './styles';

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
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [address, setAddress] = useState('');

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
          setWhatsapp(d.whatsapp || '');
          setInstagram(d.instagram || '');
          setAddress(d.address || '');
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
      if (dataToUpdate.whatsapp !== undefined) setWhatsapp(dataToUpdate.whatsapp);
      if (dataToUpdate.instagram !== undefined) setInstagram(dataToUpdate.instagram);
      if (dataToUpdate.address !== undefined) setAddress(dataToUpdate.address);

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

  const handleUpdateContactInfo = (e) => {
    e.preventDefault();
    const contactData = {
      whatsapp: whatsapp.trim(),
      instagram: instagram.trim(),
      address: address.trim(),
    };
    handleUpdateSetting(contactData, 'Informações de contato salvas com sucesso!');
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
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>Quando a loja está fechada, os clientes não podem finalizar pedidos.</p>
          <Button onClick={handleToggleStoreStatus} style={{ backgroundColor: isStoreOpen ? '#f59e0b' : '#22c55e', marginTop: '10px' }} disabled={isSubmitting}>
            {isStoreOpen ? 'FECHAR LOJA' : 'ABRIR LOJA'}
          </Button>
          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }} />
          <Form onSubmit={handleUpdateOpeningHours} style={{ margin: 0, padding: 0, border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}>
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
              <input type="text" id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://servidor.com/sua-logo.png" />
              {logoUrl && <img src={logoUrl} alt="Pré-visualização do logo" />}
            </FormGroup>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Logo'}</Button>
          </Form>
          <Form onSubmit={handleUpdateBanner}>
            <FormGroup>
              <label htmlFor="bannerUrl">URL do Banner da Página Inicial:</label>
              <input type="text" id="bannerUrl" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://servidor.com/seu-banner.jpg" />
              {bannerUrl && <img src={bannerUrl} alt="Pré-visualização do banner" />}
            </FormGroup>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Banner'}</Button>
          </Form>
        </SettingsGrid>

        <SectionTitle>Contato e Redes Sociais</SectionTitle>
        <Form onSubmit={handleUpdateContactInfo}>
          <FormGroup>
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              id="whatsapp"
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: 5511999998888 (só números com código do país)"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="instagram">Instagram</label>
            <input
              id="instagram"
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Ex: seuusuario (sem o @)"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="address">Endereço</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Rua Exemplo, 123, Bairro, Cidade - SP"
            />
          </FormGroup>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Informações de Contato'}
          </Button>
        </Form>

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