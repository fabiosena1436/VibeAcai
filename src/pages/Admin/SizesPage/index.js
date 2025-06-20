// src/pages/Admin/SizesPage/index.js

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../../services/firebaseConfig';
import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import toast from 'react-hot-toast';

// Importando todos os componentes estilizados do arquivo de estilos
import {
  Title,
  FormContainer,
  FormRow,
  InputGroup,
  Label,
  Input,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  ActionsTd,
  LoadingMessage
} from './styles';

const SizesPage = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOrder, setNewOrder] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSize, setEditingSize] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchSizes = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'sizes'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      setSizes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error("Não foi possível carregar os tamanhos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSizes(); }, [fetchSizes]);

  const handleAddSize = async (e) => {
    e.preventDefault();
    if (!newName || newPrice === '' || newOrder === '') {
      toast.error("Por favor, preencha todos os campos."); return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'sizes'), {
        name: newName,
        price: parseFloat(newPrice),
        order: parseInt(newOrder, 10),
      });
      toast.success("Tamanho adicionado com sucesso!");
      setNewName(''); setNewPrice(''); setNewOrder('');
      fetchSizes();
    } catch (error) { toast.error("Ocorreu um erro ao adicionar o tamanho."); }
    finally { setIsSubmitting(false); }
  };

  const handleUpdateSize = async (e) => {
    e.preventDefault();
    if (!editingSize || !editingSize.name || editingSize.price === '' || editingSize.order === '') {
      toast.error("Todos os campos devem ser preenchidos."); return;
    }
    setIsUpdating(true);
    try {
      const sizeDocRef = doc(db, 'sizes', editingSize.id);
      await updateDoc(sizeDocRef, {
        name: editingSize.name,
        price: parseFloat(editingSize.price),
        order: parseInt(editingSize.order, 10),
      });
      toast.success("Tamanho atualizado com sucesso!");
      setEditingSize(null);
      fetchSizes();
    } catch (error) { toast.error("Ocorreu um erro ao atualizar."); }
    finally { setIsUpdating(false); }
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, 'sizes', itemToDelete));
      toast.success("Tamanho excluído com sucesso!");
      fetchSizes();
    } catch (error) { toast.error("Ocorreu um erro ao excluir."); }
    finally { setItemToDelete(null); }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSize(prev => ({ ...prev, [name]: value }));
  };

  const smallButtonStyle = {
    padding: '6px 12px',
    fontSize: '0.9em',
  };

  return (
    <div>
      <Title>Gerir Tamanhos de Copos</Title>
      <FormContainer>
        <form onSubmit={handleAddSize}>
          <FormRow>
            <InputGroup><Label htmlFor="name">Nome do Tamanho</Label><Input id="name" type="text" placeholder="Ex: Gigante (1 Litro)" value={newName} onChange={e => setNewName(e.target.value)} /></InputGroup>
            <InputGroup><Label htmlFor="price">Preço do Tamanho (R$)</Label><Input id="price" type="number" step="0.01" placeholder="Ex: 25.00" value={newPrice} onChange={e => setNewPrice(e.target.value)} /></InputGroup>
            <InputGroup><Label htmlFor="order">Ordem de Exibição</Label><Input id="order" type="number" placeholder="Ex: 40" value={newOrder} onChange={e => setNewOrder(e.target.value)} /></InputGroup>
          </FormRow>
          <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'A adicionar...' : 'Adicionar Novo Tamanho'}</Button>
        </form>
      </FormContainer>

      {loading ? <LoadingMessage>A carregar tamanhos...</LoadingMessage> : (
        <Table>
          <Thead><Tr><Th>Ordem</Th><Th>Nome</Th><Th>Preço (R$)</Th><Th>Ações</Th></Tr></Thead>
          <tbody>
            {sizes.map(size => (
              <Tr key={size.id}>
                <Td>{size.order}</Td>
                <Td>{size.name}</Td>
                <Td>R$ {size.price.toFixed(2).replace('.', ',')}</Td>
                <ActionsTd>
                  <Button variant="primary" onClick={() => setEditingSize(size)} style={smallButtonStyle}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => setItemToDelete(size.id)} style={smallButtonStyle}>
                    Excluir
                  </Button>
                </ActionsTd>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal isOpen={!!editingSize} onClose={() => setEditingSize(null)} title="Editar Tamanho">
        {editingSize && (
          <form onSubmit={handleUpdateSize}>
            <InputGroup><Label htmlFor="edit-name">Nome do Tamanho</Label><Input id="edit-name" name="name" type="text" value={editingSize.name} onChange={handleEditInputChange} /></InputGroup>
            <InputGroup style={{ marginTop: '15px' }}><Label htmlFor="edit-price">Preço (R$)</Label><Input id="edit-price" name="price" type="number" step="0.01" value={editingSize.price} onChange={handleEditInputChange} /></InputGroup>
            <InputGroup style={{ marginTop: '15px' }}><Label htmlFor="edit-order">Ordem de Exibição</Label><Input id="edit-order" name="order" type="number" value={editingSize.order} onChange={handleEditInputChange} /></InputGroup>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button type="button" variant="secondary" onClick={() => setEditingSize(null)}>Cancelar</Button>
              <Button type="submit" variant="primary" disabled={isUpdating}>{isUpdating ? "A salvar..." : "Salvar Alterações"}</Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={executeDelete} title="Confirmar Exclusão" message="Tem a certeza de que deseja excluir este tamanho? Esta ação não pode ser desfeita." />
    </div>
  );
};

export default SizesPage;