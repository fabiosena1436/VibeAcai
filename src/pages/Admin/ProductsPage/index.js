// src/pages/Admin/ProductsPage/index.js

import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { db } from '../../../services/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { FaTrash } from 'react-icons/fa'; // Apenas para o novo botão de remover tamanho

// Importando todos os componentes estilizados do arquivo de estilos
import {
  PageWrapper,
  SectionTitle,
  AddForm,
  FormGroup,
  FormActions,
  ProductList,
  ProductListItem,
  LoadingText,
  StarIcon,
  InfoText,
  // --- NOVO --- Importando os novos componentes de estilo
  SizeManagementContainer,
  SizeInputGrid,
  SizeList,
  SizeListItem
} from './styles';

const ProductsPage = () => {
  const formRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isEditModeProduct, setIsEditModeProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // --- NOVO --- Estados para gerenciar os tamanhos do produto
  const [hasCustomizableSizes, setHasCustomizableSizes] = useState(false);
  const [productSizes, setProductSizes] = useState([]);
  const [sizeNameInput, setSizeNameInput] = useState('');
  const [sizePriceInput, setSizePriceInput] = useState('');

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const qS = await getDocs(query(collection(db, 'products'), orderBy("name")));
      setProducts(qS.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      toast.error("Não foi possível carregar os produtos.");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const qS = await getDocs(query(collection(db, 'categories'), orderBy("name")));
      setCategories(qS.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      toast.error("Não foi possível carregar as categorias.");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // --- ALTERADO --- Limpa também os estados dos tamanhos
  const clearForm = () => {
    setProductName(''); setProductDescription(''); setProductPrice('');
    setProductCategory(''); setProductImageUrl(''); setIsEditModeProduct(false);
    setEditingProductId(null);
    setHasCustomizableSizes(false);
    setProductSizes([]);
    setSizeNameInput('');
    setSizePriceInput('');
  };

  // --- ALTERADO --- Carrega os tamanhos do produto ao entrar em modo de edição
  const handleEditProduct = (product) => {
    setIsEditModeProduct(true); setEditingProductId(product.id);
    setProductName(product.name); setProductDescription(product.description || '');
    setProductPrice(product.price.toString()); setProductCategory(product.category || '');
    setProductImageUrl(product.imageUrl || '');
    // Carrega dados de tamanho do produto
    setHasCustomizableSizes(product.hasCustomizableSizes || false);
    setProductSizes(product.availableSizes || []);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- NOVO --- Funções para gerenciar a lista de tamanhos no estado
  const handleAddSize = () => {
    if (!sizeNameInput || sizePriceInput === '') {
      toast.error('Preencha o nome e o preço do tamanho.');
      return;
    }
    const newSize = { name: sizeNameInput, price: parseFloat(sizePriceInput) };
    setProductSizes([...productSizes, newSize]);
    setSizeNameInput('');
    setSizePriceInput('');
  };

  const handleRemoveSize = (indexToRemove) => {
    setProductSizes(productSizes.filter((_, index) => index !== indexToRemove));
  };
  
  // --- ALTERADO --- Lógica de submissão do formulário
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!productName || !productCategory) {
      toast.error('Preencha Nome e Categoria.');
      return;
    }
    
    // Validação específica para Açaí
    if (productCategory.toLowerCase() === 'açaí') {
      if (hasCustomizableSizes && productSizes.length === 0) {
        toast.error('Adicione pelo menos um tamanho ou desmarque a opção de tamanhos customizáveis.');
        return;
      }
      if (!hasCustomizableSizes && !productPrice) {
        toast.error('Para açaí com preço fixo, o preço base é obrigatório.');
        return;
      }
    } else { // Validação para outros produtos
      if (!productPrice) {
        toast.error('O preço é obrigatório para este tipo de produto.');
        return;
      }
    }

    setIsSubmittingProduct(true);
    const productData = {
      name: productName,
      description: productDescription,
      category: productCategory,
      imageUrl: productImageUrl,
      // Salva os dados de preço e tamanho condicionalmente
      price: productCategory.toLowerCase() === 'açaí' && hasCustomizableSizes ? 0 : parseFloat(productPrice || 0),
      hasCustomizableSizes: productCategory.toLowerCase() === 'açaí' ? hasCustomizableSizes : false,
      availableSizes: productCategory.toLowerCase() === 'açaí' && hasCustomizableSizes ? productSizes : [],
      isAvailable: isEditModeProduct ? (products.find(p => p.id === editingProductId)?.isAvailable ?? true) : true,
      isFeatured: isEditModeProduct ? (products.find(p => p.id === editingProductId)?.isFeatured ?? false) : false,
    };
    try {
      if (isEditModeProduct && editingProductId) {
        await updateDoc(doc(db, 'products', editingProductId), productData);
        toast.success('Produto atualizado!');
      } else {
        await addDoc(collection(db, 'products'), productData);
        toast.success('Produto adicionado!');
      }
      clearForm();
      fetchProducts();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error(`Falha ao ${isEditModeProduct ? 'atualizar' : 'adicionar'} produto.`);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const openDeleteConfirmModal = (product) => {
    setItemToDelete(product);
    setIsConfirmModalOpen(true);
  };

  // Funções de apagar e toggles mantidas como no original
  const handleDeleteProduct = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, 'products', itemToDelete.id));
      toast.success(`Produto "${itemToDelete.name}" excluído!`);
      fetchProducts();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      toast.error('Falha ao excluir produto.');
    } finally {
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleToggleProductAvailability = async (productId, currentAvailability) => {
    try {
      const productDocRef = doc(db, 'products', productId);
      await updateDoc(productDocRef, { isAvailable: !currentAvailability });
      toast.success(`Disponibilidade alterada!`);
      fetchProducts();
    } catch (error) {
      console.error("Erro ao alterar disponibilidade:", error);
      toast.error('Falha ao alterar disponibilidade.');
    }
  };

  const handleToggleFeatured = async (productId, currentStatus) => {
    try {
      const productDocRef = doc(db, 'products', productId);
      await updateDoc(productDocRef, { isFeatured: !currentStatus });
      toast.success('Status de destaque alterado!');
      fetchProducts();
    } catch (error) {
      console.error("Erro ao alterar destaque:", error);
      toast.error('Falha ao alterar destaque.');
    }
  };

  return (
    <>
      <PageWrapper>
        <h1>Gerenciamento de Produtos</h1>
        <SectionTitle ref={formRef}>
          {isEditModeProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </SectionTitle>
        <AddForm onSubmit={handleSubmitForm}>
          <FormGroup><label htmlFor="productName">Nome Produto:</label><input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required /></FormGroup>
          
          {/* --- ALTERADO --- Renderização condicional dos campos de preço/tamanho */}
          {productCategory.toLowerCase() !== 'açaí' && (
             <FormGroup><label htmlFor="productPrice">Preço (Ex: 12.50):</label><input type="number" id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} step="0.01" min="0" required /></FormGroup>
          )}

          <FormGroup>
            <label htmlFor="productCategory">Categoria:</label>
            <select id="productCategory" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} required>
              <option value="">Selecione uma categoria</option>
              {loadingCategories ? (<option disabled>Carregando...</option>) : (categories.map(cat => (<option key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</option>)))}
            </select>
          </FormGroup>
          <FormGroup><label htmlFor="productImageUrl">URL da Imagem:</label><input type="text" id="productImageUrl" value={productImageUrl} onChange={(e) => setProductImageUrl(e.target.value)} /></FormGroup>
          
          {productCategory.toLowerCase() === 'açaí' && (
            <>
              <FormGroup className="full-width">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" checked={hasCustomizableSizes} onChange={(e) => setHasCustomizableSizes(e.target.checked)} style={{ width: 'auto' }} />
                  Este produto tem tamanhos e preços diferentes (copos, barcas, etc)?
                </label>
              </FormGroup>
              {!hasCustomizableSizes && (
                <FormGroup>
                  <label htmlFor="productPrice">Preço Fixo (Ex: para pote de 1L):</label>
                  <input type="number" id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} step="0.01" min="0" required />
                </FormGroup>
              )}
            </>
          )}

          <FormGroup className="form-group-description"><label htmlFor="productDescription">Descrição (Opcional):</label><textarea id="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} /></FormGroup>
          
          {/* --- NOVO --- Container para gerenciar os tamanhos */}
          {productCategory.toLowerCase() === 'açaí' && hasCustomizableSizes && (
            <SizeManagementContainer>
                <SectionTitle style={{ marginTop: 0, fontSize: '1.2em' }}>Tamanhos e Preços</SectionTitle>
                <SizeInputGrid>
                    <input type="text" placeholder="Nome do Tamanho (Ex: Copo 300ml)" value={sizeNameInput} onChange={(e) => setSizeNameInput(e.target.value)} />
                    <input type="number" placeholder="Preço" step="0.01" min="0" value={sizePriceInput} onChange={(e) => setSizePriceInput(e.target.value)} />
                    <Button type="button" onClick={handleAddSize} style={{ padding: '10px' }}>Adicionar</Button>
                </SizeInputGrid>
                <SizeList>
                    {productSizes.length === 0 && <p>Nenhum tamanho adicionado.</p>}
                    {productSizes.map((size, index) => (
                        <SizeListItem key={index}>
                            <span>{size.name} - R$ {size.price.toFixed(2).replace('.', ',')}</span>
                            <button type="button" onClick={() => handleRemoveSize(index)}><FaTrash /></button>
                        </SizeListItem>
                    ))}
                </SizeList>
            </SizeManagementContainer>
          )}

          <FormActions>
            <Button type="submit" disabled={isSubmittingProduct}>{isSubmittingProduct ? (isEditModeProduct ? 'Salvando...' : 'Adicionando...') : (isEditModeProduct ? 'Salvar Alterações' : 'Adicionar Produto')}</Button>
            {isEditModeProduct && (<Button type="button" onClick={clearForm} style={{ backgroundColor: '#6b7280' }}>Cancelar Edição</Button>)}
          </FormActions>
        </AddForm>
        
        {/* --- INALTERADO --- A lista de produtos mantém a estrutura visual original */}
        <SectionTitle>Produtos Cadastrados</SectionTitle>
        {loadingProducts ? (<LoadingText>Carregando produtos...</LoadingText>) : products.length > 0 ? (
          <ProductList>
            {products.map(product => (
              <ProductListItem key={product.id}>
                {product.isFeatured && <StarIcon>⭐</StarIcon>}
                <div className="product-image-container">
                  {product.imageUrl ? (<img src={product.imageUrl} alt={product.name} />) : (<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0', fontSize: '0.8em', color: '#777' }}>Sem Imagem</div>)}
                </div>
                <div className="product-content">
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-description">{product.description || "Sem descrição."}</p>
                  <div className="product-details">
                    <span className="product-price">Preço: <strong>R$ {product.price ? product.price.toFixed(2).replace('.', ',') : '0,00'}</strong></span>
                    <span className="product-category">Categoria: <strong>{product.category || 'N/A'}</strong></span>
                    <span className={`product-status ${product.isAvailable === false ? 'unavailable' : 'available'}`}>
                      {product.isAvailable === false ? 'Indisponível' : 'Disponível'}
                    </span>
                  </div>
                </div>
                <div className="product-actions">
                  <Button onClick={() => handleToggleFeatured(product.id, product.isFeatured || false)} style={{ backgroundColor: product.isFeatured ? '#a855f7' : '#6b7280' }}>
                    {product.isFeatured ? 'Remover Destaque' : 'Destacar'}
                  </Button>
                  <Button onClick={() => handleToggleProductAvailability(product.id, product.isAvailable === undefined ? true : product.isAvailable)} style={{ backgroundColor: product.isAvailable === false ? '#22c55e' : '#7c3aed', color: product.isAvailable === false ? 'white' : '#f9f9f9' }}>
                    {product.isAvailable === false ? 'Ativar' : 'Desativar'}
                  </Button>
                  <Button onClick={() => handleEditProduct(product)} style={{ backgroundColor: '#7c3aed', color: 'white' }}>Editar</Button>
                  <Button onClick={() => openDeleteConfirmModal(product)} style={{ backgroundColor: '#dc2626', color: 'white' }}>Excluir</Button>
                </div>
              </ProductListItem>
            ))}
          </ProductList>
        ) : (<InfoText>Nenhum produto cadastrado ainda. Use o formulário acima para começar.</InfoText>)}
      </PageWrapper>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Confirmar Exclusão"
        message={`Você tem certeza que deseja excluir o produto "${itemToDelete?.name}"? Esta ação não pode ser desfeita.`}
      />
    </>
  );
};

export default ProductsPage;