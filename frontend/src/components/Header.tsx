import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../index.css';

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

const Header = () => {
  const [user, setUser] = useState(getUserFromStorage());
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const onStorage = () => setUser(getUserFromStorage());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    async function generateAvatar() {
      const { createAvatar } = await import('@dicebear/core');
      const { identicon } = await import('@dicebear/collection');
      const username = user.preferred_username || user.username || user.name || 'Gość';
      const avatar = createAvatar(identicon, { size: 32, seed: username });
      const svg = encodeURIComponent(avatar.toString());
      setAvatarUrl(`data:image/svg+xml,${svg}`);
    }
    generateAvatar();
  }, [user]);

  const isAdmin =
    (user.realm_access?.roles?.includes('admin')) ||
    (user.resource_access?.frontend?.roles?.includes('admin'));
  const username = user.preferred_username || user.username || user.name || 'Gość';

  const handleLogout = () => {
    const idToken = localStorage.getItem('keycloak-id-token');
    localStorage.removeItem('keycloak-token');
    localStorage.removeItem('keycloak-id-token');
    localStorage.removeItem('user');
    const redirect = encodeURIComponent('http://localhost:3000');
    let logoutUrl = '';
    if (idToken) {
      logoutUrl = `http://localhost:8080/realms/booking-app/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${redirect}`;
    } else {
      logoutUrl = `http://localhost:8080/realms/booking-app/protocol/openid-connect/logout?client_id=frontend&post_logout_redirect_uri=${redirect}`;
    }
    window.location.href = logoutUrl;
  };

  return (
    <header className="site-header">
      <nav className="site-nav">
        <ul className="site-nav-list">
          <li>
            <Link to="/" className="site-nav-link">Home</Link>
          </li>
          <li>
            <Link to="/bookings" className="site-nav-link">Bookings</Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin" className="site-nav-link">Admin Panel</Link>
            </li>
          )}
          <li>
            <Link to="/project" className="site-nav-link">Project Info</Link>
          </li>
          <li className="user-info">
            <img src={avatarUrl} alt="avatar" className="user-avatar" />
            <span className="user-name">{username}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;