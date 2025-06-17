// src/pages/Admin/ToppingsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';

// --- STYLED COMPONENTS ---
const Title = styled.h2` color: #333; margin-bottom: 20px; `;
const FormContainer = styled.div` background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 30px; `;
const FormRow = styled.div` display: flex; gap: 15px; margin-bottom: 15px; @media (max-width: 768px) { flex-direction: column; gap: 0; } `;
const InputGroup = styled.div` flex: 1; display: flex; flex-direction: column; @media (max-width: 768px) { margin-bottom: 15px; } `;
const Label = styled.label` margin-bottom: 5px; font-weight: 500; color: #555; `;
const Input = styled.input` padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em; `;
const CheckboxGroup = styled.div` display: flex; align-items: center; gap: 10px; margin-top: 10px; `;
const Table = styled.table` width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);`;
const Thead = styled.thead` background-color: #f8f9fa;`;
const Tr = styled.tr` &:nth-child(even) { background-color: #f2f2f2; }`;
const Th = styled.th` padding: 12px 15px; text-align: left; border-bottom: 2px solid #dee2e6; color: #495057;`;
const Td = styled.td` padding: 12px 15px; border-bottom: 1px solid #dee2e6; vertical-align: middle; `;
const ActionsTd = styled(Td)` display: flex; gap: 10px; align-items: center; height: 74px;`;
const ActionButton = styled.button` background: none; border: none; cursor: pointer; font-size: 1.1em; color: ${props => props.color || '#333'}; &:hover { opacity: 0.7; }`;
const LoadingMessage = styled.p` color: #555; font-style: italic;`;
const ImagePreview = styled.img` width: 50px; height: 50px; object-fit: cover; border-radius: 4px; `;

const ToppingsPage = () => {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newIsAvailable, setNewIsAvailable] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState(''); // <-- NOVO ESTADO para URL da imagem
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTopping, setEditingTopping] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchToppings = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'toppings'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      setToppings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { toast.error("Não foi possível carregar os adicionais."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchToppings(); }, [fetchToppings]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName || newPrice === '') { toast.error("Preencha o nome e o preço."); return; }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'toppings'), {
        name: newName,
        price: parseFloat(newPrice),
        isAvailable: newIsAvailable,
        imageUrl: newImageUrl, // <-- Adiciona o campo
      });
      toast.success("Adicional adicionado!");
      setNewName(''); setNewPrice(''); setNewIsAvailable(true); setNewImageUrl('');
      fetchToppings();
    } catch (error) { toast.error("Erro ao adicionar."); }
    finally { setIsSubmitting(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingTopping) return;
    setIsUpdating(true);
    try {
      const toppingDocRef = doc(db, 'toppings', editingTopping.id);
      await updateDoc(toppingDocRef, {
        name: editingTopping.name,
        price: parseFloat(editingTopping.price),
        isAvailable: editingTopping.isAvailable,
        imageUrl: editingTopping.imageUrl, // <-- Atualiza o campo
      });
      toast.success("Adicional atualizado!");
      setEditingTopping(null);
      fetchToppings();
    } catch (error) { toast.error("Erro ao atualizar."); }
    finally { setIsUpdating(false); }
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, 'toppings', itemToDelete));
      toast.success("Adicional excluído!");
      fetchToppings();
    } catch (error) { toast.error("Erro ao excluir."); }
    finally { setItemToDelete(null); }
  };
  
  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingTopping(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div>
      <Title>Gerir Adicionais</Title>
      <FormContainer>
        <form onSubmit={handleAdd}>
          <FormRow>
            <InputGroup><Label>Nome</Label><Input value={newName} onChange={e => setNewName(e.target.value)} /></InputGroup>
            <InputGroup><Label>Preço (R$)</Label><Input type="number" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} /></InputGroup>
          </FormRow>
          {/* NOVO CAMPO DE URL */}
          <FormRow>
            <InputGroup><Label>URL da Imagem</Label><Input placeholder='Opcional' value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} /></InputGroup>
          </FormRow>
          <CheckboxGroup><input type="checkbox" id="isAvailable" checked={newIsAvailable} onChange={e => setNewIsAvailable(e.target.checked)} /><Label htmlFor="isAvailable">Disponível para venda</Label></CheckboxGroup>
          <Button type="submit" variant="success" disabled={isSubmitting} style={{marginTop: '20px'}}>{isSubmitting ? 'A adicionar...' : 'Adicionar Adicional'}</Button>
        </form>
      </FormContainer>

      {loading ? <LoadingMessage>A carregar...</LoadingMessage> : (
        <Table>
          <Thead><Tr><Th>Imagem</Th><Th>Nome</Th><Th>Preço</Th><Th>Disponível</Th><Th>Ações</Th></Tr></Thead>
          <tbody>
            {toppings.map(topping => (
              <Tr key={topping.id}>
                <Td>{topping.imageUrl ? <ImagePreview src={topping.imageUrl} alt={topping.name} /> : 'Sem imagem'}</Td>
                <Td>{topping.name}</Td>
                <Td>R$ {topping.price.toFixed(2).replace('.', ',')}</Td>
                <Td>{topping.isAvailable ? 'Sim' : 'Não'}</Td>
                <ActionsTd>
                  <ActionButton color="#007bff" onClick={() => setEditingTopping(topping)}><FaEdit /></ActionButton>
                  <ActionButton color="#dc3545" onClick={() => setItemToDelete(topping.id)}><FaTrash /></ActionButton>
                </ActionsTd>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal isOpen={!!editingTopping} onClose={() => setEditingTopping(null)} title="Editar Adicional">
        {editingTopping && (
          <form onSubmit={handleUpdate}>
            <InputGroup><Label>Nome</Label><Input name="name" value={editingTopping.name} onChange={handleEditInputChange} /></InputGroup>
            <InputGroup style={{marginTop: '15px'}}><Label>Preço (R$)</Label><Input name="price" type="number" step="0.01" value={editingTopping.price} onChange={handleEditInputChange} /></InputGroup>
            {/* NOVO CAMPO DE URL NO MODAL DE EDIÇÃO */}
            <InputGroup style={{marginTop: '15px'}}><Label>URL da Imagem</Label><Input name="imageUrl" placeholder='Opcional' value={editingTopping.imageUrl || ''} onChange={handleEditInputChange} /></InputGroup>
            <CheckboxGroup><input type="checkbox" id="editIsAvailable" name="isAvailable" checked={editingTopping.isAvailable} onChange={handleEditInputChange} /><Label htmlFor="editIsAvailable">Disponível para venda</Label></CheckboxGroup>
            <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              <Button type="button" variant="secondary" onClick={() => setEditingTopping(null)}>Cancelar</Button>
              <Button type="submit" variant="primary" disabled={isUpdating}>{isUpdating ? "A salvar..." : "Salvar Alterações"}</Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={executeDelete} title="Confirmar Exclusão" message="Tem a certeza de que deseja excluir este adicional?"/>
    </div>
  );
};

export default ToppingsPage;