// src/pages/Admin/ToppingsPage/index.js
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
    CheckboxGroup,
    FormActions,
    InfoText,
    ToppingList,
    ToppingListItem,
    ToppingInfo,
    ToppingActions,
    LoadingText
} from './styles';

const ToppingsPage = () => {
    const [toppings, setToppings] = useState([]);
    const [toppingName, setToppingName] = useState('');
    const [toppingPrice, setToppingPrice] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [editingTopping, setEditingTopping] = useState(null);
    const [deletingTopping, setDeletingTopping] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef(null);

    const fetchToppings = async () => {
        setIsLoading(true);
        try {
            const toppingsQuery = query(collection(db, 'toppings'));
            const toppingsSnapshot = await getDocs(toppingsQuery);
            const toppingsList = toppingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setToppings(toppingsList);
        } catch (error) {
            console.error("Erro ao buscar adicionais: ", error);
            toast.error("Não foi possível carregar os adicionais.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchToppings();
    }, []);

    const handleAddOrUpdateTopping = async (e) => {
        e.preventDefault();
        if (!toppingName.trim() || !toppingPrice) {
            toast.error('Por favor, preencha o nome e o preço do adicional.');
            return;
        }

        const toppingData = {
            name: toppingName,
            price: parseFloat(toppingPrice),
            isAvailable: isAvailable
        };

        try {
            if (editingTopping) {
                const toppingDoc = doc(db, 'toppings', editingTopping.id);
                await updateDoc(toppingDoc, toppingData);
                toast.success('Adicional atualizado com sucesso!');
            } else {
                await addDoc(collection(db, 'toppings'), toppingData);
                toast.success('Adicional adicionado com sucesso!');
            }
            resetForm();
            fetchToppings();
        } catch (error) {
            console.error("Erro ao salvar adicional: ", error);
            toast.error('Ocorreu um erro ao salvar o adicional.');
        }
    };

    const handleEdit = (topping) => {
        setEditingTopping(topping);
        setToppingName(topping.name);
        setToppingPrice(topping.price);
        setIsAvailable(topping.isAvailable);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async () => {
        if (!deletingTopping) return;
        try {
            await deleteDoc(doc(db, 'toppings', deletingTopping.id));
            toast.success('Adicional removido com sucesso!');
            setDeletingTopping(null);
            fetchToppings();
        } catch (error) {
            console.error("Erro ao remover adicional: ", error);
            toast.error('Ocorreu um erro ao remover o adicional.');
        }
    };

    const resetForm = () => {
        setEditingTopping(null);
        setToppingName('');
        setToppingPrice('');
        setIsAvailable(true);
    };

    return (
        <>
            <PageWrapper>
                <h1>Gerenciar Adicionais</h1>

                <section ref={formRef}>
                    <SectionTitle>{editingTopping ? 'Editar Adicional' : 'Adicionar Novo Adicional'}</SectionTitle>
                    <Form onSubmit={handleAddOrUpdateTopping}>
                        <FormGroup>
                            <label htmlFor="toppingName">Nome do Adicional</label>
                            <input id="toppingName" type="text" value={toppingName} onChange={(e) => setToppingName(e.target.value)} placeholder="Ex: Leite em Pó" required />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="toppingPrice">Preço (R$)</label>
                            <input id="toppingPrice" type="number" step="0.01" value={toppingPrice} onChange={(e) => setToppingPrice(e.target.value)} placeholder="Ex: 1.50" required />
                        </FormGroup>
                        <FormGroup>
                            <CheckboxGroup>
                                <input id="isAvailable" type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
                                <label htmlFor="isAvailable">Disponível para seleção</label>
                            </CheckboxGroup>
                        </FormGroup>
                        <FormActions>
                            <Button type="submit" variant="primary">{editingTopping ? 'Atualizar' : 'Adicionar'}</Button>
                            {editingTopping && <Button type="button" variant="secondary" onClick={resetForm}>Cancelar</Button>}
                        </FormActions>
                    </Form>
                </section>

                <section>
                    <SectionTitle>Adicionais Cadastrados</SectionTitle>
                    <InfoText>Estes são os itens que os clientes podem adicionar aos seus açaís.</InfoText>
                    {isLoading ? (
                        <LoadingText>Carregando...</LoadingText>
                    ) : (
                        <ToppingList>
                            {toppings.map((top) => (
                                <ToppingListItem key={top.id}>
                                    <ToppingInfo>
                                        <span className="topping-name">{top.name}</span>
                                        <span className="topping-price">Preço: R$ {top.price.toFixed(2)}</span>
                                        <span className="topping-status">Status: {top.isAvailable ? 'Disponível' : 'Indisponível'}</span>
                                    </ToppingInfo>
                                    <ToppingActions>
                                        <Button variant="secondary" onClick={() => handleEdit(top)}>Editar</Button>
                                        <Button variant="danger" onClick={() => setDeletingTopping(top)}>Excluir</Button>
                                    </ToppingActions>
                                </ToppingListItem>
                            ))}
                        </ToppingList>
                    )}
                </section>
            </PageWrapper>

            <ConfirmationModal
                isOpen={!!deletingTopping}
                onClose={() => setDeletingTopping(null)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza de que deseja excluir o adicional "${deletingTopping?.name}"?`}
            />
        </>
    );
};

export default ToppingsPage;