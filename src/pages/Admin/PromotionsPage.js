import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import ConfirmationModal from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query, where } from 'firebase/firestore';

const SectionTitle = styled.h2`font-size: 1.5em; color: #555; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; &:not(:first-child){margin-top: 40px;}`;
const AddForm = styled.form`background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 10px; margin-bottom: 40px; display: flex; flex-direction: column; gap: 15px; border: 1px solid #eee;`;
const FormGroup = styled.div`display: flex; flex-direction: column; label { margin-bottom: 5px; font-weight: 600; color: #444; } input, select, textarea { padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 1em; background-color: white; }`;
const LoadingText = styled.p`text-align: center; color: #555; font-style: italic; margin-top: 20px;`;
const PromotionList = styled.ul`list-style: none; padding: 0;`;
const PromotionListItem = styled.li`
  background-color: #fff; padding: 15px; border: 1px solid #eee; border-radius: 8px;
  margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.07);
  .promo-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .promo-title { font-size: 1.2em; font-weight: bold; color: #7c3aed; margin: 0; }
  .promo-status { font-size: 0.8em; padding: 3px 6px; border-radius: 4px; font-weight: bold; flex-shrink: 0;
    &.active { background-color: #dcfce7; color: #166534; }
    &.inactive { background-color: #fee2e2; color: #991b1b; }
  }
  .promo-description { font-size: 0.95em; color: #333; margin: 0 0 15px 0; }
  .promo-description strong { color: #5b21b6; }
  .promo-actions { display: flex; gap: 10px; }
  .promo-actions button { font-size: 0.9em; padding: 6px 12px; }
`;
const ToppingsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; background-color: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 6px;`;
const ToppingCheckboxLabel = styled.label`display: flex; align-items: center; gap: 8px; font-size: 0.9em; input { width: 16px; height: 16px; }`;

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleToppingSelection = (toppingId) => setAllowedToppingIds(prev => prev.includes(toppingId) ? prev.filter(id => id !== toppingId) : [...prev, toppingId]);
  
  const handleAddPromotion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let newPromoData;

    if (promotionType === 'product_discount') {
      const priceValue = parseFloat(promotionalPrice);
      const product = products.find(p => p.id === selectedProductId);
      if (!promoTitle.trim() || !selectedProductId || isNaN(priceValue) || priceValue < 0 || !product) {
        toast.error('Preencha todos os campos para a promoção de desconto.');
        setIsSubmitting(false); return;
      }
      newPromoData = { title: promoTitle.trim(), isActive: true, createdAt: serverTimestamp(), type: promotionType, productId: product.id, productName: product.name, originalPrice: product.price, promotionalPrice: priceValue };
    } else if (promotionType === 'free_toppings_selection') {
      const limit = parseInt(freeToppingsLimit, 10);
      const product = products.find(p => p.id === selectedProductId);
      const priceValue = parseFloat(promotionalPrice);
      if (!promoTitle.trim() || !selectedProductId || allowedToppingIds.length === 0 || isNaN(limit) || limit <= 0 || !product || isNaN(priceValue) || priceValue < 0) {
        toast.error('Preencha todos os campos, incluindo o preço do combo.');
        setIsSubmitting(false); return;
      }
      newPromoData = { title: promoTitle.trim(), isActive: true, createdAt: serverTimestamp(), type: promotionType, target: { type: 'product', productId: product.id, productName: product.name }, rules: { selection_limit: limit, allowed_topping_ids: allowedToppingIds }, price: priceValue };
    }

    try {
      await addDoc(collection(db, 'promotions'), newPromoData);
      toast.success('Promoção adicionada com sucesso!');
      fetchData();
      setPromoTitle(''); setSelectedProductId(''); setPromotionalPrice(''); setFreeToppingsLimit(1); setAllowedToppingIds([]);
    } catch (error) {
      console.error("Erro ao adicionar promoção:", error);
      toast.error('Falha ao adicionar promoção.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirmModal = (promo) => { setItemToDelete(promo); setIsConfirmModalOpen(true); };
  const handleDeletePromotion = async () => { if (!itemToDelete) return; try { await deleteDoc(doc(db, 'promotions', itemToDelete.id)); toast.success(`Promoção "${itemToDelete.title}" excluída.`); fetchData(); } catch(error) { console.error("Erro ao excluir:", error); toast.error("Falha ao excluir promoção."); } finally { setIsConfirmModalOpen(false); setItemToDelete(null); }};
  const handleToggleActive = async (id, status) => { try { await updateDoc(doc(db, 'promotions', id), { isActive: !status }); fetchData(); } catch(error) { console.error("Erro ao alterar status:", error); toast.error("Falha ao alterar status."); }};

  return (
    <>
      <div>
        <h1>Gerenciamento de Promoções</h1>
        <SectionTitle>Criar Nova Promoção</SectionTitle>
        <AddForm onSubmit={handleAddPromotion}>
          <FormGroup><label htmlFor="promoTitle">Título da Promoção:</label><input type="text" id="promoTitle" value={promoTitle} onChange={(e) => setPromoTitle(e.target.value)} required /></FormGroup>
          <FormGroup><label htmlFor="promoType">Tipo de Promoção:</label><select id="promoType" value={promotionType} onChange={(e) => {setPromotionType(e.target.value); setSelectedProductId(''); setPromotionalPrice('');}}>
            <option value="product_discount">Desconto em Produto</option>
            <option value="free_toppings_selection">Adicionais Grátis (Combo)</option>
          </select></FormGroup>
          {promotionType === 'product_discount' && (<><FormGroup><label htmlFor="productSelect">Produto em Promoção:</label><select id="productSelect" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required><option value="">-- Escolha um produto --</option>{products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></FormGroup><FormGroup><label htmlFor="promoPrice">Preço Promocional (R$):</label><input type="number" id="promoPrice" value={promotionalPrice} onChange={(e) => setPromotionalPrice(e.target.value)} step="0.01" min="0" required /></FormGroup></>)}
          {promotionType === 'free_toppings_selection' && (<><FormGroup><label htmlFor="productSelectAcai">Açaí da Promoção:</label><select id="productSelectAcai" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required><option value="">-- Escolha um açaí --</option>{products.filter(p=>p.category==='açaí').map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></FormGroup><FormGroup><label htmlFor="promoPriceCombo">Preço do Combo (R$):</label><input type="number" id="promoPriceCombo" value={promotionalPrice} onChange={(e) => setPromotionalPrice(e.target.value)} step="0.01" min="0" required /></FormGroup><FormGroup><label>Adicionais Permitidos na Promoção:</label><ToppingsGrid>{toppings.map(t => (<ToppingCheckboxLabel key={t.id}><input type="checkbox" checked={allowedToppingIds.includes(t.id)} onChange={() => handleToppingSelection(t.id)} />{t.name}</ToppingCheckboxLabel>))}</ToppingsGrid></FormGroup><FormGroup><label htmlFor="freeToppingsLimit">Limite de Adicionais Grátis:</label><input type="number" id="freeToppingsLimit" value={freeToppingsLimit} onChange={(e) => setFreeToppingsLimit(e.target.value)} step="1" min="1" required /></FormGroup></>)}
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adicionando...' : 'Adicionar Promoção'}</Button>
        </AddForm>
        <SectionTitle>Promoções Cadastradas</SectionTitle>
        {loading ? ( <LoadingText>Carregando...</LoadingText> ) : promotions.length > 0 ? (<PromotionList>{promotions.map(promo => (<PromotionListItem key={promo.id}><div className="promo-info"><div className="promo-header"><h4 className="promo-title">{promo.title}</h4><span className={`promo-status ${promo.isActive ? 'active' : 'inactive'}`}>{promo.isActive ? 'Ativa' : 'Inativa'}</span></div>{promo.type === 'product_discount' && (<p className="promo-description">Desconto: <strong>{promo.productName}</strong> por <strong>R$ {promo.promotionalPrice?.toFixed(2).replace('.',',') || 'N/A'}</strong></p>)}{promo.type === 'free_toppings_selection' && (<p className="promo-description">Combo: <strong>{promo.target?.productName || ''}</strong> + <strong>{promo.rules?.selection_limit || 0}</strong> adicionais por <strong>R$ {promo.price?.toFixed(2).replace('.',',') || 'N/A'}</strong></p>)}</div><div className="promo-actions"><Button onClick={() => handleToggleActive(promo.id, promo.isActive)} style={{backgroundColor: promo.isActive ? '#facc15' : '#22c55e', color: promo.isActive ? '#422006' : 'white'}}>{promo.isActive ? 'Desativar' : 'Ativar'}</Button><Button onClick={() => openDeleteConfirmModal(promo)} style={{backgroundColor: '#ef4444'}}>Excluir</Button></div></PromotionListItem>))}</PromotionList>) : ( <p>Nenhuma promoção cadastrada.</p> )}
      </div>
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleDeletePromotion} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir a promoção "${itemToDelete?.title}"?`} />
    </>
  );
};
export default PromotionsPage;