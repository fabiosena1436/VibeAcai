// src/pages/AdminLoginPage/index.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Button from '../../components/Button';

// Importando todos os componentes estilizados do arquivo de estilos
import {
  LoginPageWrapper,
  LoginForm,
  Title,
  FormGroup,
  ErrorMessage
} from './styles';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (loginError) {
      console.error('Erro no login:', loginError.code, loginError.message);
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
        {error && <ErrorMessage>{error}</ErrorMessage>}
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