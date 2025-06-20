import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import ConfirmationModal from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query, where } from 'firebase/firestore';

// --- STYLED COMPONENTS (Sem alterações) ---
const PageWrapper = styled.div`
  h1 { font-size: 2em; color: #333; margin-bottom: 30px; }
`;
const SectionTitle = styled.h2`font-size: 1.5em; color: #555; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; &:not(:first-child){margin-top: 40px;}`;
const AddForm = styled.form`
  background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 10px; 
  margin-bottom: 40px; display: grid; gap: 15px 20px; border: 1px solid #eee;
  grid-template-columns: 1fr;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const FormGroup = styled.div`
  display: flex; flex-direction: column; 
  label { margin-bottom: 5px; font-weight: 600; color: #444; } 
  input, select, textarea { 
    padding: 10px; border: 1px solid #ccc; border-radius: 6px; 
    font-size: 1em; background-color: white; width: 100%;
  }
  &.full-width {
    grid-column: 1 / -1;
  }
`;
const FormActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  grid-column: 1 / -1;
  margin-top: 10px;
`;
const LoadingText = styled.p`text-align: center; color: #555; font-style: italic; margin-top: 20px;`;
const PromotionList = styled.ul`list-style: none; padding: 0;`;
const PromotionListItem = styled.li`
  background-color: #fff; padding: 15px; border-radius: 8px; margin-bottom: 15px; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.07);
  display: flex; justify-content: space-between; align-items: center; gap: 20px;
  .promo-info { flex-grow: 1; }
  .promo-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 15px; }
  .promo-title { font-size: 1.2em; font-weight: bold; color: #7c3aed; margin: 0; }
  .promo-status { 
    font-size: 0.8em; padding: 3px 6px; border-radius: 4px; font-weight: bold; flex-shrink: 0;
    &.active { background-color: #dcfce7; color: #166534; }
    &.inactive { background-color: #fee2e2; color: #991b1b; }
  }
  .promo-description { font-size: 0.95em; color: #333; margin: 0 0 15px 0; word-break: break-word; }
  .promo-description strong { color: #5b21b6; }
  .promo-actions { 
    display: flex; gap: 10px; flex-shrink: 0;
    button { font-size: 0.9em; padding: 6px 12px; }
  }
  @media (max-width: 768px) {
    flex-direction: column; align-items: stretch;
    .promo-actions { flex-direction: row; align-items: center; justify-content: flex-start; width: 100%;}
  }
`;
const ToppingsGrid = styled.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
  gap: 10px; background-color: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 6px;
`;
const ToppingCheckboxLabel = styled.label`display: flex; align-items: center; gap: 8px; font-size: 0.9em; cursor: pointer; input { width: 16px; height: 16px; }`;
const InfoText = styled.p`
  background-color: #f0f4f8; border-left: 4px solid #7c3aed;
  padding: 15px; border-radius: 4px; color: #333;
`;
// --- FIM DOS STYLED COMPONENTS ---

const PromotionsPage = () => {
  // --- Estados do formulário e da página ---
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NOVO: Estado para controlar a edição. Se for null, estamos criando. Se tiver um ID, estamos editando.
  const [editingPromoId, setEditingPromoId] = useState(null);

  // Estados dos campos do formulário
  const [promotionType, setPromotionType] = useState('product_discount');
  const [promoTitle, setPromoTitle] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [promotionalPrice, setPromotionalPrice] = useState('');
  const [freeToppingsLimit, setFreeToppingsLimit] = useState(1);
  const [allowedToppingIds, setAllowedToppingIds] = useState([]);

  // Estados dos modais
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

  // NOVO: Função para limpar o formulário e resetar o modo de edição.
  const resetForm = () => {
    setEditingPromoId(null);
    setPromoTitle('');
    setPromotionType('product_discount');
    setSelectedProductId('');
    setPromotionalPrice('');
    setFreeToppingsLimit(1);
    setAllowedToppingIds([]);
  };
  
  // NOVO: Função chamada ao clicar no botão "Editar".
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
  
  // MUDANÇA: A função de adicionar foi renomeada para 'handleSubmitPromotion' e agora lida tanto com criação quanto com edição.
  const handleSubmitPromotion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let promoData;

    // A lógica de validação e montagem do objeto de dados permanece a mesma
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
        promoData = { title: promoTitle.trim(), isActive: true, type: promotionType, productId: product.id, productName: product.name, originalPrice: product.price, promotionalPrice: priceValue, rules: { selection_limit: limit, allowed_topping_ids: allowedToppingIds },};
    }

    if (!promoData) { setIsSubmitting(false); return; }

    try {
      if (editingPromoId) {
        // MODO EDIÇÃO: Atualiza o documento existente
        const promoRef = doc(db, 'promotions', editingPromoId);
        await updateDoc(promoRef, promoData);
        toast.success('Promoção atualizada com sucesso!');
      } else {
        // MODO CRIAÇÃO: Adiciona um novo documento com a data de criação
        await addDoc(collection(db, 'promotions'), { ...promoData, createdAt: serverTimestamp() });
        toast.success('Promoção adicionada com sucesso!');
      }
      fetchData();
      resetForm(); // Limpa o formulário e sai do modo de edição
    } catch (error) {
      console.error("Erro ao salvar promoção:", error);
      toast.error('Falha ao salvar promoção.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToppingSelection = (toppingId) => setAllowedToppingIds(prev => prev.includes(toppingId) ? prev.filter(id => id !== toppingId) : [...prev, toppingId]);
  const openDeleteConfirmModal = (promo) => { setItemToDelete(promo); setIsConfirmModalOpen(true); };
  const handleDeletePromotion = async () => { if (!itemToDelete) return; try { await deleteDoc(doc(db, 'promotions', itemToDelete.id)); toast.success(`Promoção "${itemToDelete.title}" excluída.`); fetchData(); } catch(error) { console.error("Erro ao excluir:", error); toast.error("Falha ao excluir promoção."); } finally { setIsConfirmModalOpen(false); setItemToDelete(null); }};
  const handleToggleActive = async (id, status) => { try { await updateDoc(doc(db, 'promotions', id), { isActive: !status }); fetchData(); } catch(error) { console.error("Erro ao alterar status:", error); toast.error("Falha ao alterar status."); }};
  const renderPromoDescription = (promo) => {
    const originalPriceText = `(de R$ ${promo.originalPrice?.toFixed(2).replace('.',',')})`;
    const promotionalPriceText = `por R$ ${promo.promotionalPrice?.toFixed(2).replace('.',',') || 'N/A'}`;
    if (promo.type === 'product_discount') { return ( <p className="promo-description"> Desconto: <strong>{promo.productName}</strong> {originalPriceText} {promotionalPriceText} </p> ); }
    if (promo.type === 'free_toppings_selection') { return ( <p className="promo-description"> Combo: <strong>{promo.productName}</strong> + <strong>{promo.rules?.selection_limit || 0}</strong> adicionais grátis {originalPriceText} {promotionalPriceText} </p> ); }
    return null;
  };

  return (
    <>
      <PageWrapper>
        {/* MUDANÇA: O título da seção do formulário agora muda dinamicamente */}
        <h1>Gerenciamento de Promoções</h1>
        <SectionTitle>{editingPromoId ? 'Editar Promoção' : 'Criar Nova Promoção'}</SectionTitle>
        {/* MUDANÇA: O formulário agora chama handleSubmitPromotion */}
        <AddForm onSubmit={handleSubmitPromotion}>
          <FormGroup className="full-width"><label htmlFor="promoTitle">Título da Promoção:</label><input type="text" id="promoTitle" value={promoTitle} onChange={(e) => setPromoTitle(e.target.value)} required /></FormGroup>
          <FormGroup><label htmlFor="promoType">Tipo de Promoção:</label><select id="promoType" value={promotionType} onChange={(e) => {setPromotionType(e.target.value); setSelectedProductId(''); setPromotionalPrice('');}} disabled={!!editingPromoId}><option value="product_discount">Desconto em Produto</option><option value="free_toppings_selection">Adicionais Grátis (Combo)</option></select></FormGroup>
          
          {promotionType === 'product_discount' && (<>
            <FormGroup><label htmlFor="productSelect">Produto em Promoção:</label><select id="productSelect" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required disabled={!!editingPromoId}><option value="">-- Escolha um produto --</option>{products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></FormGroup>
            <FormGroup className="full-width"><label htmlFor="promoPrice">Preço Promocional (R$):</label><input type="number" id="promoPrice" value={promotionalPrice} onChange={(e) => setPromotionalPrice(e.target.value)} step="0.01" min="0" required /></FormGroup>
          </>)}
          
          {promotionType === 'free_toppings_selection' && (<>
            <FormGroup><label htmlFor="productSelectAcai">Açaí da Promoção:</label><select id="productSelectAcai" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required disabled={!!editingPromoId}><option value="">-- Escolha um açaí --</option>{products.filter(p=>p.category==='açaí').map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></FormGroup>
            <FormGroup><label htmlFor="promoPriceCombo">Preço do Combo (R$):</label><input type="number" id="promoPriceCombo" value={promotionalPrice} onChange={(e) => setPromotionalPrice(e.target.value)} step="0.01" min="0" required /></FormGroup>
            <FormGroup className="full-width"><label>Adicionais Permitidos na Promoção:</label><ToppingsGrid>{toppings.map(t => (<ToppingCheckboxLabel key={t.id}><input type="checkbox" checked={allowedToppingIds.includes(t.id)} onChange={() => handleToppingSelection(t.id)} />{t.name}</ToppingCheckboxLabel>))}</ToppingsGrid></FormGroup>
            <FormGroup className="full-width"><label htmlFor="freeToppingsLimit">Limite de Adicionais Grátis:</label><input type="number" id="freeToppingsLimit" value={freeToppingsLimit} onChange={(e) => setFreeToppingsLimit(e.target.value)} step="1" min="1" required /></FormGroup>
          </>)}
          
          <FormActions>
            {/* MUDANÇA: O texto do botão principal e o botão de cancelar são exibidos dinamicamente */}
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : (editingPromoId ? 'Salvar Alterações' : 'Adicionar Promoção')}</Button>
            {editingPromoId && (
              <Button type="button" onClick={resetForm} style={{backgroundColor: '#6b7280'}}>Cancelar Edição</Button>
            )}
          </FormActions>
        </AddForm>

        <SectionTitle>Promoções Cadastradas</SectionTitle>
        {loading ? ( <LoadingText>Carregando...</LoadingText> ) : promotions.length > 0 ? (
          <PromotionList>{promotions.map(promo => (
            <PromotionListItem key={promo.id}>
              <div className="promo-info">
                <div className="promo-header">
                  <h4 className="promo-title">{promo.title}</h4>
                  <span className={`promo-status ${promo.isActive ? 'active' : 'inactive'}`}>{promo.isActive ? 'Ativa' : 'Inativa'}</span>
                </div>
                {renderPromoDescription(promo)}
              </div>
              <div className="promo-actions">
                {/* NOVO: Botão de Editar adicionado */}
                <Button onClick={() => handleEditClick(promo)} style={{backgroundColor: '#3b82f6'}}>Editar</Button>
                <Button onClick={() => handleToggleActive(promo.id, promo.isActive)} style={{backgroundColor: promo.isActive ? '#7c3aed' : '#22c55e', color: promo.isActive ? '#f9f9f9' : 'white'}}>{promo.isActive ? 'Desativar' : 'Ativar'}</Button>
                <Button onClick={() => openDeleteConfirmModal(promo)} style={{backgroundColor: '#ef4444'}}>Excluir</Button>
              </div>
            </PromotionListItem>
          ))}</PromotionList>
        ) : ( <InfoText>Nenhuma promoção cadastrada.</InfoText> )}
      </PageWrapper>
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleDeletePromotion} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir a promoção "${itemToDelete?.title}"?`} />
    </>
  );
};
export default PromotionsPage;