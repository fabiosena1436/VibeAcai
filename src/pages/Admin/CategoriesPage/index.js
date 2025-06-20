// src/pages/Admin/CategoriesPage/index.js

import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { db } from '../../../services/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';

// Importando todos os componentes estilizados do arquivo de estilos
import {
  PageWrapper,
  SectionTitle,
  AddForm,
  FormGroup,
  FormActions,
  CategoryList,
  CategoryListItem,
  LoadingText,
  InfoText
} from './styles';

const CategoriesPage = () => {
  const formRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [products, setProducts] = useState([]);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [isEditModeCategory, setIsEditModeCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchCategoriesAndProducts = async () => {
    setLoadingCategories(true);
    try {
      const categoriesQuery = getDocs(collection(db, 'categories'));
      const productsQuery = getDocs(collection(db, 'products'));
      
      const [categoriesSnapshot, productsSnapshot] = await Promise.all([categoriesQuery, productsQuery]);
      
      const sortedCategories = categoriesSnapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setCategories(sortedCategories);
      setProducts(productsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      toast.error("Não foi possível carregar os dados.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);
  
  const clearForm = () => { setCategoryNameInput(''); setIsEditModeCategory(false); setEditingCategoryId(null); };
  const handleEditCategory = (category) => { setIsEditModeCategory(true); setEditingCategoryId(category.id); setCategoryNameInput(category.name); formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const handleSubmitForm = async (e) => { 
    e.preventDefault(); 
    const trimmedCategoryName = categoryNameInput.trim(); 
    if (!trimmedCategoryName) { toast.error('Por favor, insira um nome para a categoria.'); return; } 
    setIsSubmittingCategory(true); 
    const normalizedCategoryName = trimmedCategoryName.toLowerCase(); 
    try { 
      const q = query(collection(db, 'categories'), where("name_lowercase", "==", normalizedCategoryName)); 
      const querySnapshot = await getDocs(q); 
      let conflict = false; 
      querySnapshot.forEach((docSnap) => { if (!(isEditModeCategory && docSnap.id === editingCategoryId)) { conflict = true; }}); 
      if (conflict) { 
        toast.error('Uma categoria com este nome já existe!'); 
        setIsSubmittingCategory(false); 
        return; 
      } 
      if (isEditModeCategory && editingCategoryId) { 
        await updateDoc(doc(db, 'categories', editingCategoryId), { name: trimmedCategoryName, name_lowercase: normalizedCategoryName }); 
        toast.success('Categoria atualizada com sucesso!'); 
      } else { 
        await addDoc(collection(db, 'categories'), { name: trimmedCategoryName, name_lowercase: normalizedCategoryName }); 
        toast.success('Categoria adicionada com sucesso!'); 
      } 
      clearForm(); 
      fetchCategoriesAndProducts(); 
    } catch (error) { 
      console.error("Erro ao salvar categoria:", error); 
      toast.error(`Falha ao ${isEditModeCategory ? 'atualizar' : 'adicionar'} categoria.`); 
    } finally { 
      setIsSubmittingCategory(false); 
    }
  };

  const openDeleteConfirmModal = (category) => {
    setItemToDelete(category);
    setIsConfirmModalOpen(true);
  };
  
  const handleDeleteCategory = async () => { 
    if (!itemToDelete) return;

    try {
      const categoryInUse = products.some(p => p.category.toLowerCase() === itemToDelete.name.toLowerCase());
      if (categoryInUse) {
        toast.error(`A categoria "${itemToDelete.name}" está em uso e não pode ser excluída.`);
        setIsConfirmModalOpen(false);
        setItemToDelete(null);
        return;
      }
      await deleteDoc(doc(db, 'categories', itemToDelete.id)); 
      toast.success(`Categoria "${itemToDelete.name}" excluída!`); 
      fetchCategoriesAndProducts();
    } catch (error) { 
      console.error("Erro ao excluir categoria:", error); 
      toast.error('Falha ao excluir categoria.'); 
    } finally {
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <PageWrapper>
        <h1>Gerenciamento de Categorias</h1>
        <SectionTitle ref={formRef}>
          {isEditModeCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
        </SectionTitle>
        <AddForm onSubmit={handleSubmitForm}>
          <FormGroup>
            <label htmlFor="categoryNameInput">Nome da Categoria:</label>
            <input type="text" id="categoryNameInput" value={categoryNameInput} onChange={(e) => setCategoryNameInput(e.target.value)} required />
          </FormGroup>
          <FormActions>
            <Button type="submit" disabled={isSubmittingCategory}>
              {isSubmittingCategory ? (isEditModeCategory ? 'Salvando...' : 'Adicionando...') : (isEditModeCategory ? 'Salvar Alterações' : 'Adicionar Categoria')}
            </Button>
            {isEditModeCategory && (<Button type="button" onClick={clearForm} style={{backgroundColor: '#6b7280'}}>Cancelar Edição</Button>)}
          </FormActions>
        </AddForm>
        
        <SectionTitle>Categorias Existentes</SectionTitle>
        {loadingCategories ? (<LoadingText>Carregando categorias...</LoadingText>) : categories.length > 0 ? (
          <CategoryList>
            {categories.map(category => (
              <CategoryListItem key={category.id}>
                <span className="category-name">{category.name}</span>
                <div className="category-actions">
                  <Button onClick={() => handleEditCategory(category)} style={{backgroundColor: '#7c3aed', color: 'white'}}>Editar</Button>
                  <Button onClick={() => openDeleteConfirmModal(category)} style={{backgroundColor: '#dc2626', color: 'white'}}>Excluir</Button>
                </div>
              </CategoryListItem>
            ))}
          </CategoryList>
        ) : (<InfoText>Nenhuma categoria cadastrada. Use o formulário acima para começar.</InfoText>)}
      </PageWrapper>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Confirmar Exclusão"
        message={`Você tem certeza que deseja excluir a categoria "${itemToDelete?.name}"? Esta ação não poderá ser desfeita.`}
      />
    </>
  );
};

export default CategoriesPage;