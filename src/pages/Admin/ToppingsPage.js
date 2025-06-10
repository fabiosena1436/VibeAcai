// src/pages/Admin/ToppingsPage.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import ConfirmationModal from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

// --- STYLED COMPONENTS COM RESPONSIVIDADE ---
const PageWrapper = styled.div`
  h1 { font-size: 2em; color: #333; margin-bottom: 30px; }
`;
const SectionTitle = styled.h2`font-size: 1.5em; color: #555; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; &:not(:first-child){margin-top: 40px;}`;

const AddForm = styled.form`
  background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 10px; 
  margin-bottom: 40px; display: grid; gap: 15px 20px; border: 1px solid #eee;
  
  /* 1 coluna por padrão (mobile) */
  grid-template-columns: 1fr;

  /* 2 colunas para telas maiores */
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; 
  label { margin-bottom: 5px; font-weight: 600; color: #444; } 
  input { padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 1em; background-color: white; }
`;

const FormActions = styled.div`
  display: flex; gap: 10px; margin-top: 10px;
  
  /* Em telas de desktop, alinha as ações sob as duas colunas */
  @media (min-width: 768px) {
    grid-column: 1 / -1;
  }
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ToppingList = styled.ul`list-style: none; padding: 0;`;

const ToppingListItem = styled.li`
  background-color: #fff; padding: 15px; border-radius: 6px;
  margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  gap: 15px;

  .topping-info { 
    flex-grow: 1; display: flex; justify-content: space-between; align-items: center; 
    gap: 15px; flex-wrap: wrap;
  }
  .topping-name { font-weight: 500; }
  .topping-price { color: #7c3aed; font-weight: 500; }
  .topping-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
  .topping-status { 
    font-size: 0.8em; padding: 4px 8px; border-radius: 4px; font-weight: bold;
    &.available { background-color: #dcfce7; color: #166534; }
    &.unavailable { background-color: #fee2e2; color: #991b1b; }
  }
  .topping-actions button { padding: 6px 10px; font-size: 0.85em; }
  
  /* Media query para o card de adicional */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    
    .topping-info {
      flex-direction: column;
      align-items: flex-start;
    }
    .topping-actions {
      flex-wrap: wrap;
      
      .topping-status, button {
        flex-basis: calc(50% - 4px); /* Base para grade 2x2 */
        flex-grow: 1;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
`;

const LoadingText = styled.p`text-align: center; color: #555; font-style: italic; margin-top: 20px;`;
const InfoText = styled.p`
  background-color: #f0f4f8; border-left: 4px solid #7c3aed;
  padding: 15px; border-radius: 4px; color: #333;
`;

// --- FIM DOS STYLED COMPONENTS ---

const ToppingsPage = () => {
    const formRef = useRef(null);
    const [toppings, setToppings] = useState([]);
    const [loadingToppings, setLoadingToppings] = useState(true);
    const [toppingNameInput, setToppingNameInput] = useState('');
    const [toppingPriceInput, setToppingPriceInput] = useState('');
    const [isSubmittingTopping, setIsSubmittingTopping] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingToppingId, setEditingToppingId] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
  
    const fetchToppings = async () => {
      setLoadingToppings(true);
      try {
        const toppingsQuery = query(collection(db, 'toppings'), orderBy("name"));
        const querySnapshot = await getDocs(toppingsQuery);
        setToppings(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Erro ao buscar adicionais:", error);
        toast.error("Não foi possível carregar os adicionais.");
        setToppings([]);
      } finally {
        setLoadingToppings(false);
      }
    };
  
    useEffect(() => { fetchToppings(); }, []);
    
    const clearForm = () => { setToppingNameInput(''); setToppingPriceInput(''); setIsEditMode(false); setEditingToppingId(null); };
  
    const handleEditTopping = (topping) => {
      setIsEditMode(true); setEditingToppingId(topping.id);
      setToppingNameInput(topping.name); setToppingPriceInput(topping.price.toString());
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    const handleSubmitForm = async (e) => {
      e.preventDefault();
      const trimmedName = toppingNameInput.trim();
      const priceValue = parseFloat(toppingPriceInput);
      if (!trimmedName || isNaN(priceValue) || priceValue < 0) {
        toast.error('Por favor, preencha nome e preço válidos para o adicional.');
        return;
      }
      setIsSubmittingTopping(true);
      
      const toppingData = {
        name: trimmedName,
        price: priceValue,
        isAvailable: isEditMode ? (toppings.find(t => t.id === editingToppingId)?.isAvailable ?? true) : true
      };
  
      try {
        if (isEditMode && editingToppingId) {
          await updateDoc(doc(db, 'toppings', editingToppingId), toppingData);
          toast.success('Adicional atualizado com sucesso!');
        } else {
          await addDoc(collection(db, 'toppings'), toppingData);
          toast.success('Adicional cadastrado com sucesso!');
        }
        clearForm(); fetchToppings();
      } catch (error) {
        console.error("Erro ao salvar adicional:", error);
        toast.error(`Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} adicional.`);
      } finally {
        setIsSubmittingTopping(false);
      }
    };
    
    const openDeleteConfirmModal = (topping) => { setItemToDelete(topping); setIsConfirmModalOpen(true); };
  
    const handleDeleteTopping = async () => {
      if (!itemToDelete) return;
      try {
        await deleteDoc(doc(db, 'toppings', itemToDelete.id));
        toast.success(`Adicional "${itemToDelete.name}" excluído com sucesso!`);
        fetchToppings();
      } catch (error) {
        console.error("Erro ao excluir adicional:", error);
        toast.error('Falha ao excluir adicional.');
      } finally {
        setIsConfirmModalOpen(false); setItemToDelete(null);
      }
    };
  
    const handleToggleToppingAvailability = async (toppingId, currentAvailability) => {
      try {
        const toppingDocRef = doc(db, 'toppings', toppingId);
        await updateDoc(toppingDocRef, { isAvailable: !currentAvailability });
        toast.success('Disponibilidade alterada!');
        fetchToppings();
      } catch (error) {
        console.error("Erro ao alterar disponibilidade do adicional:", error);
        toast.error('Falha ao alterar disponibilidade do adicional.');
      }
    };
  
    return (
      <>
        <PageWrapper>
          <h1>Gerenciamento de Adicionais (Toppings)</h1>
          <SectionTitle ref={formRef}>
            {isEditMode ? 'Editar Adicional' : 'Adicionar Novo Adicional'}
          </SectionTitle>
          <AddForm onSubmit={handleSubmitForm}>
            <FormGroup>
              <label htmlFor="toppingNameInput">Nome do Adicional:</label>
              <input type="text" id="toppingNameInput" value={toppingNameInput} onChange={(e) => setToppingNameInput(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <label htmlFor="toppingPriceInput">Preço (R$):</label>
              <input type="number" id="toppingPriceInput" value={toppingPriceInput} onChange={(e) => setToppingPriceInput(e.target.value)} step="0.01" min="0" required />
            </FormGroup>
            <FormActions>
              <Button type="submit" disabled={isSubmittingTopping}>
                {isSubmittingTopping ? (isEditMode ? 'Salvando...' : 'Adicionando...') : (isEditMode ? 'Salvar Alterações' : 'Adicionar Adicional')}
              </Button>
              {isEditMode && (<Button type="button" onClick={clearForm} style={{backgroundColor: '#6b7280'}}>Cancelar Edição</Button>)}
            </FormActions>
          </AddForm>
  
          <SectionTitle>Adicionais Cadastrados</SectionTitle>
          {loadingToppings ? (
            <LoadingText>Carregando adicionais...</LoadingText>
          ) : toppings.length > 0 ? (
            <ToppingList>
              {toppings.map(topping => (
                <ToppingListItem key={topping.id}>
                  <div className="topping-info">
                    <span className="topping-name">{topping.name}</span>
                    <span className="topping-price">R$ {topping.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="topping-actions">
                    <span className={`topping-status ${topping.isAvailable === false ? 'unavailable' : 'available'}`}>
                      {topping.isAvailable === false ? 'Indisponível' : 'Disponível'}
                    </span>
                    <Button onClick={() => handleToggleToppingAvailability(topping.id, topping.isAvailable === undefined ? true : topping.isAvailable)} style={{backgroundColor: topping.isAvailable === false ? '#22c55e' : '#facc15', color: topping.isAvailable === false ? 'white' : '#422006'}}>
                      {topping.isAvailable === false ? 'Ativar' : 'Desativar'}
                    </Button>
                    <Button onClick={() => handleEditTopping(topping)} style={{backgroundColor: '#f59e0b', color: 'white'}}>Editar</Button>
                    <Button onClick={() => openDeleteConfirmModal(topping)} style={{backgroundColor: '#dc2626', color: 'white'}}>Excluir</Button>
                  </div>
                </ToppingListItem>
              ))}
            </ToppingList>
          ) : (
            <InfoText>Nenhum adicional cadastrado.</InfoText>
          )}
        </PageWrapper>
  
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleDeleteTopping}
          title="Confirmar Exclusão"
          message={`Você tem certeza que deseja excluir o adicional "${itemToDelete?.name}"?`}
        />
      </>
    );
  };
  
  export default ToppingsPage;