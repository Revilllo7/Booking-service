import { Link } from 'react-router-dom';
import '../index.css';

const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin =
  (user.realm_access?.roles?.includes('admin')) ||
  (user.resource_access?.frontend?.roles?.includes('admin'));
const username = user.preferred_username || user.username || user.name || 'Gość';

let avatarUrl = '';
(async () => {
  const { createAvatar } = await import('@dicebear/core');
  const { identicon } = await import('@dicebear/collection');
  const avatar = createAvatar(identicon, { size: 32, seed: username });
  const svg = encodeURIComponent(avatar.toString());
  avatarUrl = `data:image/svg+xml,${svg}`;
})();

const handleLogout = () => {
  localStorage.removeItem('keycloak-token');
  localStorage.removeItem('user');
  // Redirect to Keycloak logout, then back to login page
  window.location.href =
    'http://localhost:8080/realms/booking-app/protocol/openid-connect/logout?redirect_uri=http://localhost:3000';
};

const Header = () => (
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

export default Header;