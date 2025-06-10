// src/pages/AdminLoginPage/index.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom'; // 1. Importe useNavigate
import { auth } from '../../services/firebaseConfig'; // 2. Importe 'auth' do seu firebaseConfig
import { signInWithEmailAndPassword } from 'firebase/auth'; // 3. Importe a função de login

// ... (LoginPageWrapper, LoginForm, Title, FormGroup como antes) ...
const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px); 
  padding: 20px;
  background-color: #e9d5ff; 
`;

const LoginForm = styled.form`
  background-color: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  color: #7c3aed;
  text-align: center;
  margin-bottom: 10px;
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
  }
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1em;
    box-sizing: border-box;
    &:focus {
      border-color: #7c3aed;
      outline: none;
      box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
    }
  }
`;
// --- Fim dos Styled Components ---

const ErrorMessage = styled.p`
  color: #ef4444; /* Vermelho para erro */
  font-size: 0.9em;
  text-align: center;
  margin-top: -10px; /* Ajuste para ficar mais próximo do título */
  margin-bottom: 10px;
`;

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 4. Estado para mensagens de erro
  const navigate = useNavigate(); // 5. Para redirecionar após login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    try {
      // 6. Tenta fazer login com Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      
      // CORREÇÃO APLICADA AQUI:
      navigate('/admin/dashboard'); // Redireciona para o dashboard do admin
      
      // O alert abaixo é opcional, pode remover se não quiser mais o feedback por alerta.
      // alert('Login bem-sucedido!'); 

    } catch (loginError) {
      console.error('Erro no login:', loginError.code, loginError.message);
      // Mapear códigos de erro do Firebase para mensagens amigáveis
      if (loginError.code === 'auth/user-not-found' || loginError.code === 'auth/wrong-password' || loginError.code === 'auth/invalid-credential') {
        setError('E-mail ou senha inválidos. Por favor, tente novamente.');
      } else if (loginError.code === 'auth/invalid-email') {
        setError('O formato do e-mail é inválido.');
      } else {
        setError('Ocorreu um erro ao tentar fazer login. Tente mais tarde.');
      }
    }
  };

  return (
    <LoginPageWrapper>
      <LoginForm onSubmit={handleLogin}>
        <Title>Login Administrativo</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>} {/* 7. Exibe a mensagem de erro */}
        <FormGroup>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit" style={{ width: '100%', marginTop: '10px' }}>Entrar</Button>
      </LoginForm>
      
    </LoginPageWrapper>
  );
};

export default AdminLoginPage;