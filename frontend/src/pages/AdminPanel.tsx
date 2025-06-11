import { useEffect, useState } from 'react';
import BookingDetails from '../components/BookingDetails';

type Booking = {
  id: number;
  username: string;
  service_type: string;
  date: string;
  time: string;
  createdAt?: string;
};

const AdminPanel = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState<Booking | null>(null);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  const token = localStorage.getItem('keycloak-token') || '';

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch('/api/bookings', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setBookings(await res.json());
      }
    };
    fetchBookings();
  }, [token]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupMessage(null);
    try {
      const res = await fetch(`/api/bookings/${lookupId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      setLookupResult(await res.json());
    } catch {
      setLookupResult(null);
      setLookupMessage('Nie znaleziono rezerwacji lub brak dostępu.');
    }
  };

  return (
    <div className="booking-list">
      <h2>Panel administratora</h2>
      <p>Liczba wszystkich rezerwacji: {bookings.length}</p>
      <ul className="booking-list-items">
        {bookings.map(b => (
          <li key={b.id} className="booking-list-item">
            <span className="booking-id-badge">#{b.id}</span>
            <strong>{b.username}</strong> {b.service_type}<br />
            <span className="booking-list-date">
              {new Date(b.date).toLocaleDateString('pl-PL')} {b.time}
            </span>
            <br />
            {/* Optionally: add edit/delete buttons here */}
          </li>
        ))}
      </ul>
      <form onSubmit={handleLookup} className="booking-lookup-form">
        <input
          type="number"
          placeholder="ID rezerwacji"
          value={lookupId}
          onChange={e => setLookupId(e.target.value)}
        />
        <button type="submit">Szukaj po ID</button>
      </form>
      <div className="lookup-message">{lookupMessage}</div>
      {lookupResult && (
        <div className="booking-lookup-result">
          <BookingDetails booking={lookupResult} />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;