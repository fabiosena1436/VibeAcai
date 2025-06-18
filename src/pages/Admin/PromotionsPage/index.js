// src/pages/Admin/PromotionsPage/index.js
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
    FormGrid,
    FormGroup,
    CheckboxGroup,
    CheckboxGrid,
    FormActions,
    PromotionList,
    PromotionListItem,
    PromotionInfo,
    PromotionActions,
    LoadingText,
} from './styles';

const PromotionsPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [products, setProducts] = useState([]);
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [discountType, setDiscountType] = useState('percentage'); // 'percentage' ou 'fixed'
    const [discountValue, setDiscountValue] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [applicableProductIds, setApplicableProductIds] = useState([]);

    const [editingPromotion, setEditingPromotion] = useState(null);
    const [deletingPromotion, setDeletingPromotion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Products
                const productsQuery = query(collection(db, 'products'));
                const productsSnapshot = await getDocs(productsQuery);
                const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsData);

                // Fetch Promotions
                await fetchPromotions();
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                toast.error("Falha ao carregar dados do servidor.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchPromotions = async () => {
        const promotionsQuery = query(collection(db, 'promotions'));
        const promotionsSnapshot = await getDocs(promotionsQuery);
        setPromotions(promotionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleProductSelection = (productId) => {
        setApplicableProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleAddOrUpdatePromotion = async (e) => {
        e.preventDefault();
        if (!title || !discountValue || applicableProductIds.length === 0) {
            toast.error('Preencha título, valor do desconto e selecione ao menos um produto.');
            return;
        }

        const promotionData = {
            title,
            description,
            discountType,
            discountValue: parseFloat(discountValue),
            isActive,
            applicableProductIds,
        };
        
        try {
            if (editingPromotion) {
                const promoDoc = doc(db, 'promotions', editingPromotion.id);
                await updateDoc(promoDoc, promotionData);
                toast.success('Promoção atualizada!');
            } else {
                await addDoc(collection(db, 'promotions'), promotionData);
                toast.success('Promoção criada!');
            }
            resetForm();
            fetchPromotions();
        } catch (error) {
            console.error("Erro ao salvar promoção:", error);
            toast.error("Ocorreu um erro ao salvar a promoção.");
        }
    };

    const handleEdit = (promo) => {
        setEditingPromotion(promo);
        setTitle(promo.title);
        setDescription(promo.description);
        setDiscountType(promo.discountType);
        setDiscountValue(promo.discountValue);
        setIsActive(promo.isActive);
        setApplicableProductIds(promo.applicableProductIds);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async () => {
        if (!deletingPromotion) return;
        try {
            await deleteDoc(doc(db, 'promotions', deletingPromotion.id));
            toast.success('Promoção removida!');
            setDeletingPromotion(null);
            fetchPromotions();
        } catch (error) {
            console.error("Erro ao remover promoção:", error);
            toast.error("Ocorreu um erro ao remover a promoção.");
        }
    };
    
    const resetForm = () => {
        setEditingPromotion(null);
        setTitle('');
        setDescription('');
        setDiscountType('percentage');
        setDiscountValue('');
        setIsActive(true);
        setApplicableProductIds([]);
    };

    const getProductName = (productId) => products.find(p => p.id === productId)?.name || 'Produto não encontrado';

    return (
        <>
            <PageWrapper>
                <h1>Gerenciar Promoções</h1>

                <section ref={formRef}>
                    <SectionTitle>{editingPromotion ? 'Editar Promoção' : 'Criar Nova Promoção'}</SectionTitle>
                    <Form onSubmit={handleAddOrUpdatePromotion}>
                        <FormGroup style={{ gridColumn: '1 / -1' }}>
                            <label htmlFor="promoTitle">Título da Promoção</label>
                            <input id="promoTitle" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Açaí em Dobro" required />
                        </FormGroup>
                        <FormGroup style={{ gridColumn: '1 / -1' }}>
                            <label htmlFor="promoDesc">Descrição (opcional)</label>
                            <textarea id="promoDesc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva brevemente a promoção" />
                        </FormGroup>

                        <FormGrid>
                            <FormGroup>
                                <label htmlFor="promoDiscountType">Tipo de Desconto</label>
                                <select id="promoDiscountType" value={discountType} onChange={e => setDiscountType(e.target.value)}>
                                    <option value="percentage">Porcentagem (%)</option>
                                    <option value="fixed">Valor Fixo (R$)</option>
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="promoValue">Valor do Desconto</label>
                                <input id="promoValue" type="number" step="0.01" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder={discountType === 'percentage' ? 'Ex: 10 para 10%' : 'Ex: 5 para R$5,00'} required />
                            </FormGroup>
                        </FormGrid>
                        
                        <CheckboxGrid>
                            <h4>Aplicar em quais produtos?</h4>
                            <div className="items">
                                {products.map(product => (
                                    <CheckboxGroup key={product.id}>
                                        <input type="checkbox" id={`prod-${product.id}`} checked={applicableProductIds.includes(product.id)} onChange={() => handleProductSelection(product.id)} />
                                        <label htmlFor={`prod-${product.id}`}>{product.name}</label>
                                    </CheckboxGroup>
                                ))}
                            </div>
                        </CheckboxGrid>

                        <CheckboxGroup>
                            <input id="isActive" type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                            <label htmlFor="isActive">Ativar esta promoção no site</label>
                        </CheckboxGroup>

                        <FormActions>
                            <Button type="submit" variant="primary">{editingPromotion ? 'Atualizar' : 'Criar Promoção'}</Button>
                            {editingPromotion && <Button type="button" variant="secondary" onClick={resetForm}>Cancelar</Button>}
                        </FormActions>
                    </Form>
                </section>

                <section>
                    <SectionTitle>Promoções Ativas e Inativas</SectionTitle>
                    {isLoading ? <LoadingText>Carregando...</LoadingText> : (
                        <PromotionList>
                            {promotions.map(promo => (
                                <PromotionListItem key={promo.id}>
                                    <PromotionInfo>
                                        <h3>{promo.title}</h3>
                                        <p><strong>Descrição:</strong> {promo.description || 'N/A'}</p>
                                        <p><strong>Desconto:</strong> {promo.discountType === 'fixed' ? `R$${promo.discountValue.toFixed(2)}` : `${promo.discountValue}%`}</p>
                                        <p><strong>Status:</strong> {promo.isActive ? 'Ativa' : 'Inativa'}</p>
                                        <p><strong>Produtos:</strong> {promo.applicableProductIds.map(getProductName).join(', ')}</p>
                                    </PromotionInfo>
                                    <PromotionActions>
                                        <Button variant="secondary" onClick={() => handleEdit(promo)}>Editar</Button>
                                        <Button variant="danger" onClick={() => setDeletingPromotion(promo)}>Excluir</Button>
                                    </PromotionActions>
                                </PromotionListItem>
                            ))}
                        </PromotionList>
                    )}
                </section>
            </PageWrapper>

            <ConfirmationModal
                isOpen={!!deletingPromotion}
                onClose={() => setDeletingPromotion(null)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
                message={`Deseja realmente excluir a promoção "${deletingPromotion?.title}"?`}
            />
        </>
    );
};

export default PromotionsPage;