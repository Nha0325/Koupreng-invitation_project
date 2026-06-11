import { useEffect, useState } from 'react';
import { invitationService } from '../../shared/services/invitationService';

const GuestsPage = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchGuests() {
      try {
        // Fetch invitations of the current user
        const invitations = await invitationService.listMine('PUBLISHED');
        if (!active) return;
        if (invitations.length === 0) {
          setError('No invitations found.');
          return;
        }

        // Pick first published invitation to show its guests
        const firstInvitation = invitations[0];
        const guestList = await invitationService.getGuests(firstInvitation.id);
        if (!active) return;

        setGuests(Array.isArray(guestList) ? guestList : []);
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Failed to load guests');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchGuests();
    return () => { active = false; };
  }, []);

  if (loading) return <div>Loading guests...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Guests</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Attending</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g, i) => (
            <tr key={g.id || i}>
              <td>{i + 1}</td>
              <td>{g.name}</td>
              <td>{g.email}</td>
              <td>{g.phone}</td>
              <td>{g.isAttending ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestsPage;