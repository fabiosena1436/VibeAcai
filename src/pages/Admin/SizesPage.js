// src/pages/Admin/SizesPage.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal'; // <-- IMPORTAMOS O NOSSO MODAL!
import toast from 'react-hot-toast';

// --- STYLED COMPONENTS (sem alterações) ---
const Title = styled.h2` color: #333; margin-bottom: 20px; `;
const FormContainer = styled.div` background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 30px; `;
const FormRow = styled.div` display: flex; gap: 15px; margin-bottom: 15px; @media (max-width: 768px) { flex-direction: column; gap: 0; } `;
const InputGroup = styled.div` flex: 1; display: flex; flex-direction: column; @media (max-width: 768px) { margin-bottom: 15px; } `;
const Label = styled.label` margin-bottom: 5px; font-weight: 500; color: #555; `;
const Input = styled.input` padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em; `;
const Table = styled.table` width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);`;
const Thead = styled.thead` background-color: #f8f9fa;`;
const Tr = styled.tr` &:nth-child(even) { background-color: #f2f2f2; }`;
const Th = styled.th` padding: 12px 15px; text-align: left; border-bottom: 2px solid #dee2e6; color: #495057;`;
const Td = styled.td` padding: 12px 15px; border-bottom: 1px solid #dee2e6;`;
const ActionsTd = styled(Td)` display: flex; gap: 10px;`;
const ActionButton = styled.button` background: none; border: none; cursor: pointer; font-size: 1.1em; color: ${props => props.color || '#333'}; &:hover { opacity: 0.7; }`;
const LoadingMessage = styled.p` color: #555; font-style: italic;`;
// --- FIM DOS STYLED COMPONENTS ---

const SizesPage = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para o formulário de adição
  const [newName, setNewName] = useState('');
  const [newPriceModifier, setNewPriceModifier] = useState('');
  const [newOrder, setNewOrder] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para os modais
  const [editingSize, setEditingSize] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // <-- NOVO ESTADO PARA CONFIRMAÇÃO

  const fetchSizes = useCallback(async () => { /* ... sem alterações ... */ setLoading(true); try { const sizesCollectionRef = collection(db, 'sizes'); const q = query(sizesCollectionRef, orderBy('order', 'asc')); const querySnapshot = await getDocs(q); const sizesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setSizes(sizesList); } catch (error) { console.error("Erro ao buscar tamanhos: ", error); toast.error("Não foi possível carregar os tamanhos."); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchSizes(); }, [fetchSizes]);

  const handleAddSize = async (e) => { /* ... sem alterações ... */ e.preventDefault(); if (!newName || newPriceModifier === '' || newOrder === '') { toast.error("Por favor, preencha todos os campos."); return; } setIsSubmitting(true); try { await addDoc(collection(db, 'sizes'), { name: newName, priceModifier: parseFloat(newPriceModifier), order: parseInt(newOrder, 10), }); toast.success("Tamanho adicionado com sucesso!"); setNewName(''); setNewPriceModifier(''); setNewOrder(''); fetchSizes(); } catch (error) { console.error("Erro ao adicionar tamanho: ", error); toast.error("Ocorreu um erro ao adicionar o tamanho."); } finally { setIsSubmitting(false); } };
  const handleUpdateSize = async (e) => { /* ... sem alterações ... */ e.preventDefault(); if (!editingSize || !editingSize.name || editingSize.priceModifier === '' || editingSize.order === '') { toast.error("Todos os campos devem ser preenchidos."); return; } setIsUpdating(true); try { const sizeDocRef = doc(db, 'sizes', editingSize.id); await updateDoc(sizeDocRef, { name: editingSize.name, priceModifier: parseFloat(editingSize.priceModifier), order: parseInt(editingSize.order, 10), }); toast.success("Tamanho atualizado com sucesso!"); setEditingSize(null); fetchSizes(); } catch (error) { console.error("Erro ao atualizar tamanho: ", error); toast.error("Ocorreu um erro ao atualizar."); } finally { setIsUpdating(false); } };
  const handleEditInputChange = (e) => { /* ... sem alterações ... */ const { name, value } = e.target; setEditingSize(prev => ({ ...prev, [name]: value })); };

  // A função de exclusão agora só faz a exclusão
  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, 'sizes', itemToDelete));
      toast.success("Tamanho excluído com sucesso!");
      fetchSizes();
    } catch (error) {
      console.error("Erro ao excluir tamanho: ", error);
      toast.error("Ocorreu um erro ao excluir.");
    } finally {
      setItemToDelete(null); // Fecha o modal de confirmação
    }
  };


  return (
    <div>
      <Title>Gerir Tamanhos de Copos</Title>
      
      <FormContainer>
        <form onSubmit={handleAddSize}>
            {/* Formulário de Adição (sem alterações) */}
            <FormRow>
                <InputGroup><Label htmlFor="name">Nome do Tamanho</Label><Input id="name" type="text" placeholder="Ex: Gigante (1 Litro)" value={newName} onChange={e => setNewName(e.target.value)} /></InputGroup>
                <InputGroup><Label htmlFor="priceModifier">Modificador de Preço (R$)</Label><Input id="priceModifier" type="number" step="0.01" placeholder="Ex: 12.00" value={newPriceModifier} onChange={e => setNewPriceModifier(e.target.value)} /></InputGroup>
                <InputGroup><Label htmlFor="order">Ordem de Exibição</Label><Input id="order" type="number" placeholder="Ex: 40" value={newOrder} onChange={e => setNewOrder(e.target.value)} /></InputGroup>
            </FormRow>
            <Button type="submit" variant="success" disabled={isSubmitting}>{isSubmitting ? 'A adicionar...' : 'Adicionar Novo Tamanho'}</Button>
        </form>
      </FormContainer>
      
      {loading ? <LoadingMessage>A carregar tamanhos...</LoadingMessage> : (
        <Table>
          <Thead>
            <Tr>
              <Th>Ordem</Th><Th>Nome</Th><Th>Modificador de Preço (R$)</Th><Th>Ações</Th>
            </Tr>
          </Thead>
          <tbody>
            {sizes.map(size => (
              <Tr key={size.id}>
                <Td>{size.order}</Td>
                <Td>{size.name}</Td>
                <Td>R$ {size.priceModifier.toFixed(2).replace('.', ',')}</Td>
                <ActionsTd>
                  <ActionButton color="#007bff" onClick={() => setEditingSize(size)}><FaEdit /></ActionButton>
                  {/* Ao clicar, agora apenas preparamos para a exclusão */}
                  <ActionButton color="#dc3545" onClick={() => setItemToDelete(size.id)}><FaTrash /></ActionButton>
                </ActionsTd>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal de Edição (sem alterações) */}
      <Modal isOpen={!!editingSize} onClose={() => setEditingSize(null)} title="Editar Tamanho">
        {editingSize && ( <form onSubmit={handleUpdateSize}> <InputGroup> <Label htmlFor="edit-name">Nome do Tamanho</Label> <Input id="edit-name" name="name" type="text" value={editingSize.name} onChange={handleEditInputChange} /> </InputGroup> <InputGroup style={{marginTop: '15px'}}> <Label htmlFor="edit-priceModifier">Modificador de Preço (R$)</Label> <Input id="edit-priceModifier" name="priceModifier" type="number" step="0.01" value={editingSize.priceModifier} onChange={handleEditInputChange} /> </InputGroup> <InputGroup style={{marginTop: '15px'}}> <Label htmlFor="edit-order">Ordem de Exibição</Label> <Input id="edit-order" name="order" type="number" value={editingSize.order} onChange={handleEditInputChange} /> </InputGroup> <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}> <Button type="button" variant="secondary" onClick={() => setEditingSize(null)}>Cancelar</Button> <Button type="submit" variant="primary" disabled={isUpdating}>{isUpdating ? "A salvar..." : "Salvar Alterações"}</Button> </div> </form> )}
      </Modal>

      {/* NOVO Modal de Confirmação de Exclusão */}
      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={executeDelete}
        title="Confirmar Exclusão"
        message="Tem a certeza de que deseja excluir este tamanho? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default SizesPage;