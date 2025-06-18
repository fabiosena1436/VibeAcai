// src/pages/Admin/SettingsPage/index.js
import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import toast from 'react-hot-toast';
import { useStoreSettings } from '../../../contexts/StoreSettingsContext';
import {
    SettingsWrapper,
    Title,
    SettingsForm,
    FormSection,
    SectionTitle,
    FormGroup,
    SwitchContainer,
    SwitchLabel,
    SwitchInput,
    SwitchSlider,
} from './styles';

const SettingsPage = () => {
    const { settings, updateSettings, loading } = useStoreSettings();

    // Estado local para gerenciar o formulário
    const [isStoreOpen, setIsStoreOpen] = useState(false);
    const [allowDelivery, setAllowDelivery] = useState(false);
    const [allowPickup, setAllowPickup] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(0);
    
    // Alimenta o estado local quando as configurações do contexto são carregadas
    useEffect(() => {
        if (settings) {
            setIsStoreOpen(settings.isStoreOpen ?? false);
            setAllowDelivery(settings.allowDelivery ?? false);
            setAllowPickup(settings.allowPickup ?? false);
            setDeliveryFee(settings.deliveryFee ?? 0);
        }
    }, [settings]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateSettings({
                isStoreOpen,
                allowDelivery,
                allowPickup,
                deliveryFee: parseFloat(deliveryFee)
            });
            toast.success('Configurações salvas com sucesso!');
        } catch (error) {
            console.error("Erro ao salvar configurações:", error);
            toast.error('Falha ao salvar as configurações.');
        }
    };
    
    if (loading) {
        return <p>Carregando configurações...</p>;
    }

    return (
        <SettingsWrapper>
            <Title>Configurações da Loja</Title>
            <SettingsForm onSubmit={handleSave}>
                <FormSection>
                    <SectionTitle>Status de Funcionamento</SectionTitle>
                    <SwitchContainer>
                        <SwitchLabel>Loja Aberta / Fechada</SwitchLabel>
                        <div className="switch-wrapper">
                            <SwitchInput 
                                type="checkbox" 
                                checked={isStoreOpen} 
                                onChange={(e) => setIsStoreOpen(e.target.checked)}
                            />
                            <SwitchSlider />
                        </div>
                    </SwitchContainer>
                </FormSection>

                <FormSection>
                    <SectionTitle>Opções de Entrega</SectionTitle>
                    <SwitchContainer>
                        <SwitchLabel>Permitir Delivery</SwitchLabel>
                         <div className="switch-wrapper">
                            <SwitchInput 
                                type="checkbox" 
                                checked={allowDelivery} 
                                onChange={(e) => setAllowDelivery(e.target.checked)}
                            />
                            <SwitchSlider />
                        </div>
                    </SwitchContainer>
                    <SwitchContainer>
                        <SwitchLabel>Permitir Retirada no Local</SwitchLabel>
                         <div className="switch-wrapper">
                             <SwitchInput 
                                type="checkbox" 
                                checked={allowPickup} 
                                onChange={(e) => setAllowPickup(e.target.checked)}
                            />
                            <SwitchSlider />
                        </div>
                    </SwitchContainer>
                    {allowDelivery && (
                         <FormGroup>
                            <label htmlFor="deliveryFee">Taxa de Entrega (R$)</label>
                            <input 
                                id="deliveryFee" 
                                type="number" 
                                step="0.50" 
                                value={deliveryFee}
                                onChange={(e) => setDeliveryFee(e.target.value)}
                            />
                        </FormGroup>
                    )}
                </FormSection>
                
                <Button type="submit" variant="primary" style={{ alignSelf: 'flex-start' }}>
                    Salvar Alterações
                </Button>
            </SettingsForm>
        </SettingsWrapper>
    );
};

export default SettingsPage;