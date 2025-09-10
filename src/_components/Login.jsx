import React, { useState } from 'react';
import './Login.css';
import { FaUserCircle } from 'react-icons/fa';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister ? form : { email: form.email, password: form.password };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido');
      if (isRegister) {
        setSuccess('Cadastro realizado com sucesso! Faça login.');
        setIsRegister(false);
      } else {
        setSuccess('Login realizado!');
        localStorage.setItem('token', data.token);
        // Redirecionar ou atualizar estado global do usuário
      }
    } catch (err) {
      setError(err.message);
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
