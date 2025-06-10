// src/pages/Admin/CategoriesPage.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import ConfirmationModal from '../../components/ConfirmationModal'; // Importa o modal
import toast from 'react-hot-toast'; // Importa o toast
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';

// --- STYLED COMPONENTS ---
const SectionTitle = styled.h2`font-size: 1.5em; color: #555; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;`;
const AddForm = styled.form`background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 10px; margin-bottom: 40px; display: flex; flex-direction: column; gap: 15px; border: 1px solid #eee;`;
const FormGroup = styled.div`display: flex; flex-direction: column; label { margin-bottom: 5px; font-weight: 600; color: #444; } input[type="text"] { padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 1em; background-color: white; }`;
const FormActions = styled.div`display: flex; gap: 10px; margin-top: 10px;`;
const CategoryList = styled.ul`list-style: none; padding: 0; margin-top: 10px;`;
const CategoryListItem = styled.li`
  background-color: #fff; padding: 10px 15px; border: 1px solid #eee; border-radius: 6px; margin-bottom: 8px; 
  display: flex; justify-content: space-between; align-items: center; font-size: 1em; color: #333;
  .category-actions button { margin-left: 8px; padding: 5px 8px; font-size: 0.8em; }
`;
const LoadingText = styled.p`text-align: center; color: #555; font-style: italic; margin-top: 20px;`;
// --- FIM DOS STYLED COMPONENTS ---

const CategoriesPage = () => {
  const formRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [products, setProducts] = useState([]);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [isEditModeCategory, setIsEditModeCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Estados para o modal de confirmação
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchCategoriesAndProducts = async () => {
    setLoadingCategories(true);
    try {
      const categoriesQuery = getDocs(collection(db, 'categories'));
      const productsQuery = getDocs(collection(db, 'products'));
      
      const [categoriesSnapshot, productsSnapshot] = await Promise.all([categoriesQuery, productsQuery]);
      
      setCategories(categoriesSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
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
    if (!trimmedCategoryName) { 
      toast.error('Por favor, insira um nome para a categoria.'); 
      return; 
    } 
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
      const categoryInUse = products.some(p => p.category === itemToDelete.name.toLowerCase());
      if (categoryInUse) {
        toast.error(`A categoria "${itemToDelete.name}" está em uso e não pode ser excluída.`);
        setIsConfirmModalOpen(false); // Fecha o modal mesmo se der erro
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
      <div>
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
                <span>{category.name}</span>
                <div className="category-actions">
                  <Button onClick={() => handleEditCategory(category)} style={{backgroundColor: '#f59e0b', color: 'white'}}>Editar</Button>
                  {/* Botão de Excluir agora abre o modal */}
                  <Button onClick={() => openDeleteConfirmModal(category)} style={{backgroundColor: '#dc2626', color: 'white'}}>Excluir</Button>
                </div>
              </CategoryListItem>
            ))}
          </CategoryList>
        ) : (<p>Nenhuma categoria cadastrada.</p>)}
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Confirmar Exclusão de Categoria"
        message={`Você tem certeza que deseja excluir a categoria "${itemToDelete?.name}"? Se algum produto estiver usando esta categoria, a exclusão será bloqueada.`}
      />
    </>
  );
};

export default CategoriesPage;