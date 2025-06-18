// src/pages/Admin/CategoriesPage/index.js
import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { db } from '../../../services/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
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
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef(null);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const categoriesCollection = query(collection(db, 'categories'));
            const categorySnapshot = await getDocs(categoriesCollection);
            const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoryList);
        } catch (error) {
            console.error("Erro ao buscar categorias: ", error);
            toast.error("Não foi possível carregar as categorias.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddOrUpdateCategory = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            toast.error('O nome da categoria não pode estar vazio.');
            return;
        }

        const categoryData = { name: categoryName };

        try {
            if (editingCategory) {
                const categoryDoc = doc(db, 'categories', editingCategory.id);
                await updateDoc(categoryDoc, categoryData);
                toast.success('Categoria atualizada com sucesso!');
            } else {
                await addDoc(collection(db, 'categories'), categoryData);
                toast.success('Categoria adicionada com sucesso!');
            }
            resetForm();
            fetchCategories();
        } catch (error) {
            console.error("Erro ao salvar categoria: ", error);
            toast.error('Ocorreu um erro ao salvar a categoria.');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async () => {
        if (!deletingCategory) return;

        try {
            await deleteDoc(doc(db, 'categories', deletingCategory.id));
            toast.success('Categoria removida com sucesso!');
            setDeletingCategory(null);
            fetchCategories();
        } catch (error) {
            console.error("Erro ao remover categoria: ", error);
            toast.error('Ocorreu um erro ao remover a categoria.');
        }
    };

    const resetForm = () => {
        setCategoryName('');
        setEditingCategory(null);
    };

    return (
        <>
            <PageWrapper>
                <h1>Gerenciar Categorias</h1>

                <section ref={formRef}>
                    <SectionTitle>{editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</SectionTitle>
                    <AddForm onSubmit={handleAddOrUpdateCategory}>
                        <FormGroup>
                            <label htmlFor="categoryName">Nome da Categoria</label>
                            <input
                                id="categoryName"
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Ex: Açaís, Cremes, Sucos"
                                required
                            />
                        </FormGroup>
                        <FormActions>
                            <Button type="submit" variant="primary">{editingCategory ? 'Atualizar' : 'Adicionar'}</Button>
                            {editingCategory && <Button type="button" variant="secondary" onClick={resetForm}>Cancelar</Button>}
                        </FormActions>
                    </AddForm>
                </section>
                
                <section>
                    <SectionTitle>Categorias Existentes</SectionTitle>
                    <InfoText>As categorias são usadas para agrupar os produtos no cardápio.</InfoText>
                    {isLoading ? (
                        <LoadingText>Carregando...</LoadingText>
                    ) : (
                        <CategoryList>
                            {categories.map((cat) => (
                                <CategoryListItem key={cat.id}>
                                    <span className="category-name">{cat.name}</span>
                                    <div className="category-actions">
                                        <Button variant="secondary" onClick={() => handleEdit(cat)}>Editar</Button>
                                        <Button variant="danger" onClick={() => setDeletingCategory(cat)}>Excluir</Button>
                                    </div>
                                </CategoryListItem>
                            ))}
                        </CategoryList>
                    )}
                </section>
            </PageWrapper>

            <ConfirmationModal
                isOpen={!!deletingCategory}
                onClose={() => setDeletingCategory(null)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir a categoria "${deletingCategory?.name}"?`}
            />
        </>
    );
};

export default CategoriesPage;