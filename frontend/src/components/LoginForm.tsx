import { useState } from 'react';

const LoginForm = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Zalogowano!');
      window.location.href = '/bookings';
    } else {
      setMessage('Błędny login lub hasło.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Logowanie</h2>
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
      <button type="submit">Zaloguj</button>
      {message && <div style={{ color: 'red', marginTop: 8 }}>{message}</div>}
    </form>
  );
};

export default LoginForm;