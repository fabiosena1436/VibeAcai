import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { db } from '../../../services/firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query, where } from 'firebase/firestore';

// Importando os novos componentes de estilo
import {
  PageWrapper,
  SectionTitle,
  AddForm,
  FormGroup,
  FormActions,
  LoadingText,
  PromotionList,
  PromotionListItem,
  ToppingsGrid,
  ToppingCheckboxLabel,
  InfoText,
  ProductImage, // <-- Importado
  PromoContent  // <-- Importado
} from './styles';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState(null);

  const [promotionType, setPromotionType] = useState('product_discount');
  const [promoTitle, setPromoTitle] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [promotionalPrice, setPromotionalPrice] = useState('');
  const [freeToppingsLimit, setFreeToppingsLimit] = useState(1);
  const [allowedToppingIds, setAllowedToppingIds] = useState([]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const promoQuery = query(collection(db, 'promotions'), orderBy("createdAt", "desc"));
      const productsQuery = query(collection(db, 'products'), where("isAvailable", "==", true), orderBy("name"));
      const toppingsQuery = query(collection(db, 'toppings'), orderBy("name"));

      const [promoSnapshot, productsSnapshot, toppingsSnapshot] = await Promise.all([
        getDocs(promoQuery), getDocs(productsQuery), getDocs(toppingsQuery)
      ]);

      setPromotions(promoSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setProducts(productsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setToppings(toppingsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Falha ao carregar dados da página.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setEditingPromoId(null);
    setPromoTitle('');
    setPromotionType('product_discount');
    setSelectedProductId('');
    setPromotionalPrice('');
    setFreeToppingsLimit(1);
    setAllowedToppingIds([]);
  };

  const handleEditClick = (promo) => {
    setEditingPromoId(promo.id);
    setPromoTitle(promo.title);
    setPromotionType(promo.type);
    setSelectedProductId(promo.productId);
    setPromotionalPrice(promo.promotionalPrice);
    
    if (promo.type === 'free_toppings_selection') {
      setFreeToppingsLimit(promo.rules?.selection_limit || 1);
      setAllowedToppingIds(promo.rules?.allowed_topping_ids || []);
    } else {
      setFreeToppingsLimit(1);
      setAllowedToppingIds([]);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast('Modo de edição ativado.', { icon: '✏️' });
  };

  const handleSubmitPromotion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let promoData;

    if (promotionType === 'product_discount') {
      const priceValue = parseFloat(promotionalPrice);
      const product = products.find(p => p.id === selectedProductId);
      if (!promoTitle.trim() || !selectedProductId || isNaN(priceValue) || priceValue < 0 || !product) {
        toast.error('Preencha todos os campos para a promoção de desconto.');
        setIsSubmitting(false); return;
      }
      promoData = { title: promoTitle.trim(), isActive: true, type: promotionType, productId: product.id, productName: product.name, originalPrice: product.price, promotionalPrice: priceValue };
    } else if (promotionType === 'free_toppings_selection') {
      const limit = parseInt(freeToppingsLimit, 10);
      const product = products.find(p => p.id === selectedProductId);
      const priceValue = parseFloat(promotionalPrice);
      if (!promoTitle.trim() || !selectedProductId || allowedToppingIds.length === 0 || isNaN(limit) || limit <= 0 || !product || isNaN(priceValue) || priceValue < 0) {
        toast.error('Preencha todos os campos, incluindo o preço do combo e adicionais.');
        setIsSubmitting(false); return;
      }
      promoData = { title: promoTitle.trim(), isActive: true, type: promotionType, productId: product.id, productName: product.name, originalPrice: product.price, promotionalPrice: priceValue, rules: { selection_limit: limit, allowed_topping_ids: allowedToppingIds }, };
    }

    if (!promoData) { setIsSubmitting(false); return; }

    try {
      if (editingPromoId) {
        const promoRef = doc(db, 'promotions', editingPromoId);
        await updateDoc(promoRef, promoData);
        toast.success('Promoção atualizada com sucesso!');
      } else {
        await addDoc(collection(db, 'promotions'), { ...promoData, createdAt: serverTimestamp() });
        toast.success('Promoção adicionada com sucesso!');
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar promoção:", error);
      toast.error('Falha ao salvar promoção.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToppingSelection = (toppingId) => setAllowedToppingIds(prev => prev.includes(toppingId) ? prev.filter(id => id !== toppingId) : [...prev, toppingId]);
  const openDeleteConfirmModal = (promo) => { setItemToDelete(promo); setIsConfirmModalOpen(true); };
  const handleDeletePromotion = async () => { if (!itemToDelete) return; try { await deleteDoc(doc(db, 'promotions', itemToDelete.id)); toast.success(`Promoção "${itemToDelete.title}" excluída.`); fetchData(); } catch (error) { console.error("Erro ao excluir:", error); toast.error("Falha ao excluir promoção."); } finally { setIsConfirmModalOpen(false); setItemToDelete(null); } };
  const handleToggleActive = async (id, status) => { try { await updateDoc(doc(db, 'promotions', id), { isActive: !status }); fetchData(); } catch (error) { console.error("Erro ao alterar status:", error); toast.error("Falha ao alterar status."); } };
  const renderPromoDescription = (promo) => {
    const originalPriceText = `(de R$ ${promo.originalPrice?.toFixed(2).replace('.', ',')})`;
    const promotionalPriceText = `por R$ ${promo.promotionalPrice?.toFixed(2).replace('.', ',') || 'N/A'}`;
    if (promo.type === 'product_discount') { return (<p className="promo-description"> Desconto: <strong>{promo.productName}</strong> {originalPriceText} {promotionalPriceText} </p>); }
    if (promo.type === 'free_toppings_selection') { return (<p className="promo-description"> Combo: <strong>{promo.productName}</strong> + <strong>{promo.rules?.selection_limit || 0}</strong> adicionais grátis {originalPriceText} {promotionalPriceText} </p>); }
    return null;
  };

  return (
    <>
      <PageWrapper>
        <h1>Gerenciamento de Promoções</h1>
        <SectionTitle>{editingPromoId ? 'Editar Promoção' : 'Criar Nova Promoção'}</SectionTitle>
        <AddForm onSubmit={handleSubmitPromotion}>
          <FormGroup className="full-width"><label htmlFor="promoTitle">Título da Promoção:</label><input type="text" id="promoTitle" value={promoTitle} onChange={(e) => setPromoTitle(e.target.value)} required /></FormGroup>
          <FormGroup><label htmlFor="promoType">Tipo de Promoção:</label><select id="promoType" value={promotionType} onChange={(e) => { setPromotionType(e.target.value); setSelectedProductId(''); setPromotionalPrice(''); }} disabled={!!editingPromoId}><option value="product_discount">Desconto em Produto</option><option value="free_toppings_selection">Adicionais Grátis (Combo)</option></select></FormGroup>

          {promotionType === 'product_discount' && (<>
            <FormGroup><label htmlFor="productSelect">Produto em Promoção:</label><select id="productSelect" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required disabled={!!editingPromoId}><option value="">-- Escolha um produto --</option>{products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></FormGroup>
            <FormGroup className="full-width"><label htmlFor="promoPrice">Preço Promocional (R$):</label><input type="number" id="promoPrice" value={promotionalPrice} onChange={(e) => setPromotionalPrice(e.target.value)} step="0.01" min="0" required /></FormGroup>
          </>)}

          {promotionType === 'free_toppings_selection' && (<>
            <FormGroup><label htmlFor="productSelectAcai">Açaí da Promoção:</label><select id="productSelectAcai" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required disabled={!!editingPromoId}><option value="">-- Escolha um açaí --</option>{products.filter(p => p.category === 'açaí').map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></FormGroup>
            <FormGroup><label htmlFor="promoPriceCombo">Preço do Combo (R$):</label><input type="number" id="promoPriceCombo" value={promotionalPrice} onChange={(e) => setPromotionalPrice(e.target.value)} step="0.01" min="0" required /></FormGroup>
            <FormGroup className="full-width"><label>Adicionais Permitidos na Promoção:</label><ToppingsGrid>{toppings.map(t => (<ToppingCheckboxLabel key={t.id}><input type="checkbox" checked={allowedToppingIds.includes(t.id)} onChange={() => handleToppingSelection(t.id)} />{t.name}</ToppingCheckboxLabel>))}</ToppingsGrid></FormGroup>
            <FormGroup className="full-width"><label htmlFor="freeToppingsLimit">Limite de Adicionais Grátis:</label><input type="number" id="freeToppingsLimit" value={freeToppingsLimit} onChange={(e) => setFreeToppingsLimit(e.target.value)} step="1" min="1" required /></FormGroup>
          </>)}

          <FormActions>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : (editingPromoId ? 'Salvar Alterações' : 'Adicionar Promoção')}</Button>
            {editingPromoId && (
              <Button type="button" onClick={resetForm} style={{ backgroundColor: '#6b7280' }}>Cancelar Edição</Button>
            )}
          </FormActions>
        </AddForm>

        <SectionTitle>Promoções Cadastradas</SectionTitle>
        {loading ? (<LoadingText>Carregando...</LoadingText>) : promotions.length > 0 ? (
          <PromotionList>{promotions.map(promo => {
           
            const product = products.find(p => p.id === promo.productId);

            return (
              <PromotionListItem key={promo.id}>
                <ProductImage 
                  src={product?.imageUrl || 'https://via.placeholder.com/150'} 
                  alt={product?.name || 'Produto da promoção'} 
                />
                <PromoContent>
                  <div className="promo-info">
                    <div className="promo-header">
                      <h4 className="promo-title">{promo.title}</h4>
                      <span className={`promo-status ${promo.isActive ? 'active' : 'inactive'}`}>{promo.isActive ? 'Ativa' : 'Inativa'}</span>
                    </div>
                    {renderPromoDescription(promo)}
                  </div>
                  <div className="promo-actions">
                    <Button onClick={() => handleEditClick(promo)} style={{ backgroundColor: '#3b82f6' }}>Editar</Button>
                    <Button onClick={() => handleToggleActive(promo.id, promo.isActive)} style={{ backgroundColor: promo.isActive ? '#7c3aed' : '#22c55e', color: promo.isActive ? '#f9f9f9' : 'white' }}>{promo.isActive ? 'Desativar' : 'Ativar'}</Button>
                    <Button onClick={() => openDeleteConfirmModal(promo)} style={{ backgroundColor: '#ef4444' }}>Excluir</Button>
                  </div>
                </PromoContent>
              </PromotionListItem>
            );
          })}</PromotionList>
        ) : (<InfoText>Nenhuma promoção cadastrada.</InfoText>)}
      </PageWrapper>
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleDeletePromotion} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir a promoção "${itemToDelete?.title}"?`} />
    </>
  );
};

export default PromotionsPage;