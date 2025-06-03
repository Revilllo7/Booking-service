import { useState } from 'react';

const RegisterForm = () => {
  const [form, setForm] = useState({ username: '', password: '', role: 'client' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage('Rejestracja udana! Możesz się zalogować.');
    } else {
      setMessage('Błąd rejestracji.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Rejestracja</h2>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Nazwa użytkownika"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Hasło"
        required
      />
      <button type="submit">Zarejestruj</button>
      {message && <div style={{ color: 'red', marginTop: 8 }}>{message}</div>}
    </form>
  );
};

export default RegisterForm;