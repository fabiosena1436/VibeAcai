// src/pages/Admin/ProductsPage/index.js
import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { db } from '../../../services/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query } from 'firebase/firestore';
import { 
    PageWrapper, 
    SectionTitle, 
    Form, 
    FormGroup, 
    FormActions, 
    ProductList, 
    ProductListItem,
    ProductInfo,
    ProductActions,
    LoadingText,
    CheckboxGroup
} from './styles';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const formRef = useRef(null);

    // Buscar dados iniciais (produtos, categorias, tamanhos)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Categorias
                const categoriesQuery = query(collection(db, 'categories'));
                const categoriesSnapshot = await getDocs(categoriesQuery);
                const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCategories(categoriesData);
                if (categoriesData.length > 0) {
                    setProductCategory(categoriesData[0].id);
                }

                // Tamanhos
                const sizesQuery = query(collection(db, 'sizes'));
                const sizesSnapshot = await getDocs(sizesQuery);
                setSizes(sizesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                
                // Produtos
                await fetchProducts();

            } catch (error) {
                console.error("Erro ao buscar dados: ", error);
                toast.error('Falha ao carregar dados do servidor.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    
    const fetchProducts = async () => {
        const productsQuery = query(collection(db, 'products'));
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
    };
    
    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();
        if (!productName || !productCategory || !productPrice) {
            toast.error('Por favor, preencha nome, categoria e preço.');
            return;
        }

        const productData = {
            name: productName,
            description: productDescription,
            categoryId: productCategory,
            basePrice: parseFloat(productPrice),
            isAvailable: isAvailable,
        };

        try {
            if (editingProduct) {
                const productDoc = doc(db, 'products', editingProduct.id);
                await updateDoc(productDoc, productData);
                toast.success('Produto atualizado com sucesso!');
            } else {
                await addDoc(collection(db, 'products'), productData);
                toast.success('Produto adicionado com sucesso!');
            }
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error("Erro ao salvar produto: ", error);
            toast.error('Ocorreu um erro ao salvar o produto.');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setProductName(product.name);
        setProductDescription(product.description);
        setProductCategory(product.categoryId);
        setProductPrice(product.basePrice);
        setIsAvailable(product.isAvailable);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async () => {
        if (!deletingProduct) return;
        try {
            await deleteDoc(doc(db, 'products', deletingProduct.id));
            toast.success('Produto removido com sucesso!');
            setDeletingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Erro ao remover produto: ", error);
            toast.error('Ocorreu um erro ao remover o produto.');
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setProductName('');
        setProductDescription('');
        setProductPrice('');
        setIsAvailable(true);
        if (categories.length > 0) {
            setProductCategory(categories[0].id);
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Sem Categoria';
    };

    return (
        <>
            <PageWrapper>
                <h1>Gerenciar Produtos</h1>
                
                <section ref={formRef}>
                    <SectionTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</SectionTitle>
                    <Form onSubmit={handleAddOrUpdateProduct}>
                        <FormGroup>
                            <label htmlFor="productName">Nome do Produto</label>
                            <input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Ex: Açaí Tradicional" required />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="productDescription">Descrição</label>
                            <textarea id="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Ex: Acompanha banana e granola" />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="productCategory">Categoria</label>
                            <select id="productCategory" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} required>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="productPrice">Preço Base (R$)</label>
                            <input id="productPrice" type="number" step="0.01" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="Ex: 10.00 (não inclui valor do copo)" required />
                        </FormGroup>
                         <FormGroup>
                            <CheckboxGroup>
                                <input id="isAvailable" type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
                                <label htmlFor="isAvailable">Produto Disponível</label>
                            </CheckboxGroup>
                        </FormGroup>
                        <FormActions>
                            <Button type="submit" variant="primary">{editingProduct ? 'Atualizar' : 'Adicionar'}</Button>
                            {editingProduct && <Button type="button" variant="secondary" onClick={resetForm}>Cancelar Edição</Button>}
                        </FormActions>
                    </Form>
                </section>
                
                <section>
                    <SectionTitle>Lista de Produtos</SectionTitle>
                    {isLoading ? (
                        <LoadingText>Carregando produtos...</LoadingText>
                    ) : (
                        <ProductList>
                            {products.map(prod => (
                                <ProductListItem key={prod.id}>
                                    <ProductInfo>
                                        <h3>{prod.name}</h3>
                                        <p><strong>Descrição:</strong> {prod.description || 'N/A'}</p>
                                        <p><strong>Categoria:</strong> {getCategoryName(prod.categoryId)}</p>
                                        <p><strong>Preço Base:</strong> R$ {parseFloat(prod.basePrice).toFixed(2)}</p>
                                        <p><strong>Status:</strong> {prod.isAvailable ? 'Disponível' : 'Indisponível'}</p>
                                    </ProductInfo>
                                    <ProductActions>
                                        <Button variant="secondary" onClick={() => handleEdit(prod)}>Editar</Button>
                                        <Button variant="danger" onClick={() => setDeletingProduct(prod)}>Excluir</Button>
                                    </ProductActions>
                                </ProductListItem>
                            ))}
                        </ProductList>
                    )}
                </section>
            </PageWrapper>

            <ConfirmationModal
                isOpen={!!deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza de que deseja excluir o produto "${deletingProduct?.name}"? Esta ação não pode ser desfeita.`}
            />
        </>
    );
};

export default ProductsPage;