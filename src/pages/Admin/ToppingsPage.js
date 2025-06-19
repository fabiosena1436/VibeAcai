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

// --- STYLED COMPONENTS (sem alterações) ---
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
    const [categories, setCategories] = useState([]); // <-- NOVO ESTADO para categorias
    const [loading, setLoading] = useState(true);

    // Estados para o formulário de adição
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newCategory, setNewCategory] = useState(''); // <-- NOVO ESTADO
    const [newIsAvailable, setNewIsAvailable] = useState(true);
    const [newImageUrl, setNewImageUrl] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTopping, setEditingTopping] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // --- ALTERADO: Função de busca agora busca toppings E categorias ---
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

        } catch (error) { toast.error("Não foi possível carregar os dados."); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // --- NOVO: Função para lidar com a criação de categorias ---
    const handleCategoryManagement = async (categoryName) => {
        if (!categoryName) return ''; // Retorna string vazia se não houver nome
        const trimmedName = categoryName.trim();
        
        // Verifica se a categoria já existe (ignorando maiúsculas/minúsculas)
        const existingCategory = categories.find(cat => cat.name.toLowerCase() === trimmedName.toLowerCase());
        if (existingCategory) {
            return existingCategory.name; // Retorna o nome já existente para manter a consistência
        }

        // Se não existe, cria uma nova
        try {
            const docRef = await addDoc(collection(db, 'toppingCategories'), { name: trimmedName });
            // Adiciona a nova categoria ao estado local para não precisar buscar tudo de novo
            setCategories(prev => [...prev, { id: docRef.id, name: trimmedName }].sort((a, b) => a.name.localeCompare(b.name)));
            return trimmedName;
        } catch (error) {
            toast.error("Não foi possível criar a nova categoria.");
            return ''; // Retorna vazio em caso de erro
        }
    };

    // --- ALTERADO: handleAdd agora gerencia a categoria ---
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName || newPrice === '') { toast.error("Preencha o nome e o preço."); return; }
        setIsSubmitting(true);
        
        const finalCategoryName = await handleCategoryManagement(newCategory);

        try {
            await addDoc(collection(db, 'toppings'), {
                name: newName,
                price: parseFloat(newPrice),
                isAvailable: newIsAvailable,
                imageUrl: newImageUrl,
                category: finalCategoryName, // <-- Adiciona o campo de categoria
            });
            toast.success("Adicional adicionado!");
            setNewName(''); setNewPrice(''); setNewIsAvailable(true); setNewImageUrl(''); setNewCategory('');
            fetchData(); // Busca os dados novamente para atualizar a lista
        } catch (error) { toast.error("Erro ao adicionar."); }
        finally { setIsSubmitting(false); }
    };

    // --- ALTERADO: handleUpdate agora gerencia a categoria ---
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
                category: finalCategoryName, // <-- Atualiza o campo de categoria
            });
            toast.success("Adicional atualizado!");
            setEditingTopping(null);
            fetchData();
        } catch (error) { toast.error("Erro ao atualizar."); }
        finally { setIsUpdating(false); }
    };

    const executeDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteDoc(doc(db, 'toppings', itemToDelete));
            toast.success("Adicional excluído!");
            fetchData();
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
                        <InputGroup><Label>Nome</Label><Input value={newName} onChange={e => setNewName(e.target.value)} required /></InputGroup>
                        <InputGroup><Label>Preço (R$)</Label><Input type="number" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} required /></InputGroup>
                    </FormRow>
                    <FormRow>
                        {/* NOVO CAMPO DE CATEGORIA COM DATALIST */}
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
                    <CheckboxGroup><input type="checkbox" id="isAvailable" checked={newIsAvailable} onChange={e => setNewIsAvailable(e.target.checked)} /><Label htmlFor="isAvailable">Disponível para venda</Label></CheckboxGroup>
                    <Button type="submit" variant="success" disabled={isSubmitting} style={{marginTop: '20px'}}>{isSubmitting ? 'A adicionar...' : 'Adicionar Adicional'}</Button>
                </form>
            </FormContainer>

            {loading ? <LoadingMessage>A carregar...</LoadingMessage> : (
                <Table>
                    {/* AQUI ADICIONAMOS A COLUNA CATEGORIA NA TABELA */}
                    <Thead><Tr><Th>Imagem</Th><Th>Nome</Th><Th>Categoria</Th><Th>Preço</Th><Th>Disponível</Th><Th>Ações</Th></Tr></Thead>
                    <tbody>
                        {toppings.map(topping => (
                            <Tr key={topping.id}>
                                <Td>{topping.imageUrl ? <ImagePreview src={topping.imageUrl} alt={topping.name} /> : 'Sem imagem'}</Td>
                                <Td>{topping.name}</Td>
                                <Td>{topping.category || 'N/A'}</Td> {/* Mostra a categoria */}
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

            {/* MODAL DE EDIÇÃO TAMBÉM ATUALIZADO */}
            <Modal isOpen={!!editingTopping} onClose={() => setEditingTopping(null)} title="Editar Adicional">
                {editingTopping && (
                    <form onSubmit={handleUpdate}>
                        <InputGroup><Label>Nome</Label><Input name="name" value={editingTopping.name} onChange={handleEditInputChange} /></InputGroup>
                        <InputGroup style={{marginTop: '15px'}}><Label>Preço (R$)</Label><Input name="price" type="number" step="0.01" value={editingTopping.price} onChange={handleEditInputChange} /></InputGroup>
                        <InputGroup style={{marginTop: '15px'}}>
                            <Label>Categoria</Label>
                            <Input 
                                list="categories-list" 
                                name="category"
                                value={editingTopping.category || ''}
                                onChange={handleEditInputChange}
                                placeholder="Ex: Frutas (ou crie uma nova)"
                            />
                        </InputGroup>
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