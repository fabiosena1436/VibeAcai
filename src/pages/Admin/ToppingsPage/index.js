// src/pages/Admin/ToppingsPage/index.js

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
  CheckboxGroup,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  ActionsTd,
  ImagePreview,
  LoadingMessage,
  MobileCardContainer,
  DesktopTableContainer,
  ToppingCard,
  CardHeader,
  CardTitle,
  CardBody,
  InfoRow,
  CardActions
} from './styles';

const ToppingsPage = () => {
  const [toppings, setToppings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newIsAvailable, setNewIsAvailable] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTopping, setEditingTopping] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const toppingsQuery = query(collection(db, 'toppings'), orderBy('name', 'asc'));
      const categoriesQuery = query(collection(db, 'toppingCategories'), orderBy('name', 'asc'));
      const [toppingsSnapshot, categoriesSnapshot] = await Promise.all([
        getDocs(toppingsQuery),
        getDocs(categoriesQuery)
      ]);
      setToppings(toppingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCategories(categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCategoryManagement = async (categoryName) => {
    if (!categoryName) return '';
    const trimmedName = categoryName.trim();
    const existingCategory = categories.find(cat => cat.name.toLowerCase() === trimmedName.toLowerCase());
    if (existingCategory) {
      return existingCategory.name;
    }
    try {
      const docRef = await addDoc(collection(db, 'toppingCategories'), { name: trimmedName });
      setCategories(prev => [...prev, { id: docRef.id, name: trimmedName }].sort((a, b) => a.name.localeCompare(b.name)));
      return trimmedName;
    } catch (error) {
      toast.error("Não foi possível criar a nova categoria.");
      return '';
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName || newPrice === '') {
      toast.error("Preencha o nome e o preço.");
      return;
    }
    setIsSubmitting(true);
    const finalCategoryName = await handleCategoryManagement(newCategory);
    try {
      await addDoc(collection(db, 'toppings'), {
        name: newName,
        price: parseFloat(newPrice),
        isAvailable: newIsAvailable,
        imageUrl: newImageUrl,
        category: finalCategoryName,
      });
      toast.success("Adicional adicionado!");
      setNewName('');
      setNewPrice('');
      setNewIsAvailable(true);
      setNewImageUrl('');
      setNewCategory('');
      fetchData();
    } catch (error) {
      toast.error("Erro ao adicionar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingTopping) return;
    setIsUpdating(true);
    const finalCategoryName = await handleCategoryManagement(editingTopping.category);
    try {
      const toppingDocRef = doc(db, 'toppings', editingTopping.id);
      await updateDoc(toppingDocRef, {
        name: editingTopping.name,
        price: parseFloat(editingTopping.price),
        isAvailable: editingTopping.isAvailable,
        imageUrl: editingTopping.imageUrl,
        category: finalCategoryName,
      });
      toast.success("Adicional atualizado!");
      setEditingTopping(null);
      fetchData();
    } catch (error) {
      toast.error("Erro ao atualizar.");
    } finally {
      setIsUpdating(false);
    }
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, 'toppings', itemToDelete));
      toast.success("Adicional excluído!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao excluir.");
    } finally {
      setItemToDelete(null);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingTopping(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const smallButtonStyle = {
    padding: '6px 12px',
    fontSize: '0.9em',
  };

  return (
    <div>
      <Title>Gerir Adicionais</Title>
      <FormContainer>
        <form onSubmit={handleAdd}>
          <FormRow>
            <InputGroup><Label>Nome</Label><Input value={newName} onChange={e => setNewName(e.target.value)} required /></InputGroup>
            <InputGroup><Label>Preço (R$)</Label><Input type="number" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} required /></InputGroup>
          </FormRow>
          <FormRow>
            <InputGroup>
              <Label>Categoria</Label>
              <Input
                list="categories-list"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="Ex: Frutas (ou crie uma nova)"
              />
              <datalist id="categories-list">
                {categories.map(cat => <option key={cat.id} value={cat.name} />)}
              </datalist>
            </InputGroup>
            <InputGroup>
              <Label>URL da Imagem</Label>
              <Input placeholder='Opcional' value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} />
            </InputGroup>
          </FormRow>
          <CheckboxGroup>
            <input type="checkbox" id="isAvailable" checked={newIsAvailable} onChange={e => setNewIsAvailable(e.target.checked)} />
            <Label htmlFor="isAvailable">Disponível para venda</Label>
          </CheckboxGroup>
          <Button type="submit" variant="primary" disabled={isSubmitting} style={{ marginTop: '20px', width: '100%' }}>
            {isSubmitting ? 'A adicionar...' : 'Adicionar Adicional'}
          </Button>
        </form>
      </FormContainer>

      {loading ? (
        <LoadingMessage>A carregar...</LoadingMessage>
      ) : (
        <>
          <DesktopTableContainer>
            <Table>
              <Thead><Tr><Th>Imagem</Th><Th>Nome</Th><Th>Categoria</Th><Th>Preço</Th><Th>Disponível</Th><Th>Ações</Th></Tr></Thead>
              <tbody>
                {toppings.map(topping => (
                  <Tr key={topping.id}>
                    <Td>{topping.imageUrl ? <ImagePreview src={topping.imageUrl} alt={topping.name} /> : 'Sem imagem'}</Td>
                    <Td>{topping.name}</Td>
                    <Td>{topping.category || 'N/A'}</Td>
                    <Td>R$ {topping.price.toFixed(2).replace('.', ',')}</Td>
                    <Td>{topping.isAvailable ? 'Sim' : 'Não'}</Td>
                    <ActionsTd>
                      <Button variant="primary" onClick={() => setEditingTopping(topping)} style={smallButtonStyle}>Editar</Button>
                      <Button variant="danger" onClick={() => setItemToDelete(topping.id)} style={smallButtonStyle}>Excluir</Button>
                    </ActionsTd>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </DesktopTableContainer>

          <MobileCardContainer>
            {toppings.map(topping => (
              <ToppingCard key={topping.id}>
                <CardHeader>
                  <ImagePreview src={topping.imageUrl || 'https://via.placeholder.com/50'} alt={topping.name} />
                  <CardTitle>{topping.name}</CardTitle>
                </CardHeader>
                <CardBody>
                  <InfoRow><strong>Preço:</strong> R$ {topping.price.toFixed(2).replace('.', ',')}</InfoRow>
                  <InfoRow><strong>Categoria:</strong> {topping.category || 'N/A'}</InfoRow>
                  <InfoRow><strong>Disponível:</strong> {topping.isAvailable ? 'Sim' : 'Não'}</InfoRow>
                </CardBody>
                <CardActions>
                  <Button variant="primary" onClick={() => setEditingTopping(topping)} style={{ flex: 1 }}>Editar</Button>
                  <Button variant="danger" onClick={() => setItemToDelete(topping.id)} style={{ flex: 1 }}>Excluir</Button>
                </CardActions>
              </ToppingCard>
            ))}
          </MobileCardContainer>
        </>
      )}

      <Modal isOpen={!!editingTopping} onClose={() => setEditingTopping(null)} title="Editar Adicional">
        {editingTopping && (
          <form onSubmit={handleUpdate}>
            <InputGroup><Label>Nome</Label><Input name="name" value={editingTopping.name} onChange={handleEditInputChange} /></InputGroup>
            <InputGroup style={{ marginTop: '15px' }}><Label>Preço (R$)</Label><Input name="price" type="number" step="0.01" value={editingTopping.price} onChange={handleEditInputChange} /></InputGroup>
            <InputGroup style={{ marginTop: '15px' }}>
              <Label>Categoria</Label>
              <Input
                list="categories-list"
                name="category"
                value={editingTopping.category || ''}
                onChange={handleEditInputChange}
                placeholder="Ex: Frutas (ou crie uma nova)"
              />
            </InputGroup>
            <InputGroup style={{ marginTop: '15px' }}><Label>URL da Imagem</Label><Input name="imageUrl" placeholder='Opcional' value={editingTopping.imageUrl || ''} onChange={handleEditInputChange} /></InputGroup>
            <CheckboxGroup>
              <input type="checkbox" id="editIsAvailable" name="isAvailable" checked={editingTopping.isAvailable} onChange={handleEditInputChange} />
              <Label htmlFor="editIsAvailable">Disponível para venda</Label>
            </CheckboxGroup>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button type="button" variant="secondary" onClick={() => setEditingTopping(null)}>Cancelar</Button>
              <Button type="submit" variant="primary" disabled={isUpdating}>{isUpdating ? "A salvar..." : "Salvar Alterações"}</Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={executeDelete}
        title="Confirmar Exclusão"
        message="Tem a certeza de que deseja excluir este adicional?"
      />
    </div>
  );
};

export default ToppingsPage;