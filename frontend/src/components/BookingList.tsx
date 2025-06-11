import { useEffect, useState } from 'react';
import { deleteBooking, updateBooking, getBooking } from '../api/Bookings';
import '../index.css';
import BookingDetails from './BookingDetails';

type Booking = {
  id: number;
  username: string;
  service_type: string;
  date: string;
  time: string;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

const SERVICE_OPTIONS = [
  "strzyżenie damskie",
  "strzyżenie męskie",
  "strzyżenie brody",
  "strzyżenie dziecięce",
  "koloryzacja",
  "modelowanie",
  "pielęgnacja",
  "fryzura okolicznościowa"
];

const BookingList = ({ refreshFlag }: { refreshFlag?: number }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ service_type: '', date: '', time: '' });
  const token = localStorage.getItem('keycloak-token') || '';

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch('/api/bookings', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else if (res.status === 401) {
        setBookings([]);
      }
    };
    fetchBookings();
  }, [refreshFlag, token]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Na pewno usunąć tę rezerwację?')) return;
    await deleteBooking(id);
    setBookings(bookings.filter(b => b.id !== id));
  };

  const handleEdit = (booking: Booking) => {
    setEditingId(booking.id);
    setEditForm({
      service_type: booking.service_type,
      date: booking.date.slice(0, 10),
      time: booking.time,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;
    await updateBooking(editingId, editForm);
    setEditingId(null);
    // Refresh bookings
    const res = await fetch('/api/bookings', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const data = await res.json();
      setBookings(data);
    }
  };

  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState<Booking | null>(null);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupMessage(null);
    try {
      const booking = await getBooking(Number(lookupId));
      const bookingUsername = (booking.username || '').trim().toLowerCase();
      // Use the updated isAdmin check here!
      if (!isAdmin && bookingUsername !== userUsername) {
        setLookupResult(null);
        setLookupMessage('Nie masz rezerwacji o takim ID.');
        return;
      }
      setLookupResult(booking);
    } catch {
      setLookupResult(null);
      setLookupMessage('Nie znaleziono rezerwacji lub brak dostępu.');
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin =
    (user.realm_access?.roles?.includes('admin')) ||
    (user.resource_access?.frontend?.roles?.includes('admin'));
  const userUsername = (user.preferred_username || user.username || user.name || '').trim().toLowerCase();

  const visibleBookings = isAdmin
    ? bookings
    : bookings.filter(b => (b.username || '').trim().toLowerCase() === userUsername);

  console.log('Bookings:', bookings);
  console.log('visibleBookings:', visibleBookings);
  return (
    <div className="booking-list">
      <h2 className="booking-list-title">Twoje rezerwacje</h2>
      <p>Liczba rezerwacji: {visibleBookings.length}</p>
      <ul className="booking-list-items">
        {visibleBookings.map((b) => (
          <li key={b.id} className="booking-list-item" style={{ position: 'relative' }}>
            <span className="booking-id-badge">#{b.id}</span>
            {editingId === b.id ? (
              <form onSubmit={handleEditSubmit}>
                <select
                  name="service_type"
                  value={editForm.service_type}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Wybierz usługę</option>
                  {SERVICE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <input
                  type="date"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                  required
                />
                <select
                  name="time"
                  value={editForm.time}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Wybierz godzinę</option>
                  <option value="09:00">09:00</option>
                  <option value="09:30">09:30</option>
                  <option value="10:00">10:00</option>
                  <option value="10:30">10:30</option>
                  <option value="11:00">11:00</option>
                  <option value="11:30">11:30</option>
                  <option value="12:00">12:00</option>
                  <option value="12:30">12:30</option>
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="14:30">14:30</option>
                  <option value="15:00">15:00</option>
                  <option value="15:30">15:30</option>
                  <option value="16:00">16:00</option>
                  <option value="16:30">16:30</option>
                  <option value="17:00">17:00</option>
                </select>
                <button type="submit">Zapisz</button>
                <button type="button" onClick={() => setEditingId(null)}>Anuluj</button>
              </form>
            ) : (
              <>
                <strong>{b.username}</strong> {b.service_type}<br />
                <span className="booking-list-date">
                  {formatDate(b.date)} {b.time}
                </span>
                <br />
                <button onClick={() => handleEdit(b)}>Edytuj</button>
                <button onClick={() => handleDelete(b.id)}>Usuń</button>
              </>
            )}
          </li>
        ))}
        <form onSubmit={handleLookup} className="booking-lookup-form">
          <input
            type="number"
            placeholder="ID rezerwacji"
            value={lookupId}
            onChange={e => setLookupId(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button type="submit">Szukaj po ID</button>
        </form>
        <div className="lookup-message">{lookupMessage}</div>
        {lookupResult && (
          <div className="booking-lookup-result">
            <BookingDetails booking={lookupResult} />
          </div>
        )}
      </ul>
    </div>
  );
};

export default BookingList;
