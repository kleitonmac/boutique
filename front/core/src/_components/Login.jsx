import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';
import { FaUserCircle } from 'react-icons/fa';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isRegister) {
        const result = await register(form.name, form.email, form.password);
        if (result.success) {
          setSuccess('Cadastro realizado com sucesso! Faça login.');
          setIsRegister(false);
          setForm({ name: '', email: '', password: '' });
        } else {
          setError(result.error);
        }
      } else {
        const result = await login(form.email, form.password);
        if (result.success) {
          setSuccess('Login realizado com sucesso!');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <span className="login-icon-top"><FaUserCircle /></span>
        <h2>{isRegister ? 'Cadastro' : 'Login'}</h2>
        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : isRegister ? 'Cadastrar' : 'Entrar'}
        </button>
        <span className="toggle-link" onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}>
          {isRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </span>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
      </form>
    </div>
  );
};

export default Login;
