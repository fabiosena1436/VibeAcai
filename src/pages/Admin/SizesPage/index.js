// src/pages/Admin/SizesPage/index.js
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
    InfoText,
    SizeList,
    SizeListItem,
    SizeInfo,
    SizeActions,
    LoadingText
} from './styles';

const SizesPage = () => {
    const [sizes, setSizes] = useState([]);
    const [sizeName, setSizeName] = useState('');
    const [sizePrice, setSizePrice] = useState('');
    const [editingSize, setEditingSize] = useState(null);
    const [deletingSize, setDeletingSize] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef(null);

    const fetchSizes = async () => {
        setIsLoading(true);
        try {
            const sizesQuery = query(collection(db, 'sizes'));
            const sizesSnapshot = await getDocs(sizesQuery);
            const sizesList = sizesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSizes(sizesList);
        } catch (error) {
            console.error("Erro ao buscar tamanhos: ", error);
            toast.error("Não foi possível carregar os tamanhos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSizes();
    }, []);

    const handleAddOrUpdateSize = async (e) => {
        e.preventDefault();
        if (!sizeName.trim() || !sizePrice) {
            toast.error('Por favor, preencha o nome e o preço do tamanho.');
            return;
        }

        const sizeData = {
            name: sizeName,
            price: parseFloat(sizePrice),
        };

        try {
            if (editingSize) {
                const sizeDoc = doc(db, 'sizes', editingSize.id);
                await updateDoc(sizeDoc, sizeData);
                toast.success('Tamanho atualizado com sucesso!');
            } else {
                await addDoc(collection(db, 'sizes'), sizeData);
                toast.success('Tamanho adicionado com sucesso!');
            }
            resetForm();
            fetchSizes();
        } catch (error) {
            console.error("Erro ao salvar tamanho: ", error);
            toast.error('Ocorreu um erro ao salvar o tamanho.');
        }
    };

    const handleEdit = (size) => {
        setEditingSize(size);
        setSizeName(size.name);
        setSizePrice(size.price);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async () => {
        if (!deletingSize) return;
        try {
            await deleteDoc(doc(db, 'sizes', deletingSize.id));
            toast.success('Tamanho removido com sucesso!');
            setDeletingSize(null);
            fetchSizes();
        } catch (error) {
            console.error("Erro ao remover tamanho: ", error);
            toast.error('Ocorreu um erro ao remover o tamanho.');
        }
    };

    const resetForm = () => {
        setEditingSize(null);
        setSizeName('');
        setSizePrice('');
    };

    return (
        <>
            <PageWrapper>
                <h1>Gerenciar Tamanhos dos Copos</h1>

                <section ref={formRef}>
                    <SectionTitle>{editingSize ? 'Editar Tamanho' : 'Adicionar Novo Tamanho'}</SectionTitle>
                    <Form onSubmit={handleAddOrUpdateSize}>
                        <FormGroup>
                            <label htmlFor="sizeName">Nome do Tamanho</label>
                            <input id="sizeName" type="text" value={sizeName} onChange={(e) => setSizeName(e.target.value)} placeholder="Ex: 300ml, 500ml, 700ml" required />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="sizePrice">Preço (R$)</label>
                            <input id="sizePrice" type="number" step="0.01" value={sizePrice} onChange={(e) => setSizePrice(e.target.value)} placeholder="Ex: 12.00" required />
                        </FormGroup>
                        <FormActions>
                            <Button type="submit" variant="primary">{editingSize ? 'Atualizar' : 'Adicionar'}</Button>
                            {editingSize && <Button type="button" variant="secondary" onClick={resetForm}>Cancelar</Button>}
                        </FormActions>
                    </Form>
                </section>

                <section>
                    <SectionTitle>Tamanhos Cadastrados</SectionTitle>
                    <InfoText>O preço do tamanho é o valor base que será somado ao preço do produto (se houver).</InfoText>
                    {isLoading ? (
                        <LoadingText>Carregando...</LoadingText>
                    ) : (
                        <SizeList>
                            {sizes.map((s) => (
                                <SizeListItem key={s.id}>
                                    <SizeInfo>
                                        <span className="size-name">{s.name}</span>
                                        <span className="size-price">Preço: R$ {s.price.toFixed(2)}</span>
                                    </SizeInfo>
                                    <SizeActions>
                                        <Button variant="secondary" onClick={() => handleEdit(s)}>Editar</Button>
                                        <Button variant="danger" onClick={() => setDeletingSize(s)}>Excluir</Button>
                                    </SizeActions>
                                </SizeListItem>
                            ))}
                        </SizeList>
                    )}
                </section>
            </PageWrapper>

            <ConfirmationModal
                isOpen={!!deletingSize}
                onClose={() => setDeletingSize(null)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza de que deseja excluir o tamanho "${deletingSize?.name}"?`}
            />
        </>
    );
};

export default SizesPage;