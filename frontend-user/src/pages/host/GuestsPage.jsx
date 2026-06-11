import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { invitationService } from "../../shared/services/invitationService";
import { guestService } from "../../shared/services/guestService";

function pickInvitation(invitations) {
  const items = Array.isArray(invitations) ? invitations : [];
  return (
    items.find((item) => item?.status === "PUBLISHED" && item?.id) ||
    items.find((item) => item?.id) ||
    null
  );
}

function guestName(guest) {
  return guest?.guestName || guest?.name || "Guest";
}

function guestSeats(guest) {
  return guest?.seatCount ?? guest?.count ?? 1;
}

const GuestsPage = () => {
  const [invitation, setInvitation] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchGuests() {
      try {
        const published = await invitationService.listMine("PUBLISHED");
        let targetInvitation = pickInvitation(published);

        if (!targetInvitation) {
          const allInvitations = await invitationService.listMine();
          targetInvitation = pickInvitation(allInvitations);
        }

        if (!active) return;

        if (!targetInvitation?.id) {
          setInvitation(null);
          setGuests([]);
          setError("No invitation found. Create an invitation first to manage guests.");
          return;
        }

        setInvitation(targetInvitation);

        const guestList = await guestService.listByInvitation(targetInvitation.id);
        if (!active) return;

        setGuests(Array.isArray(guestList) ? guestList : []);
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Failed to load guests");
        setGuests([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchGuests();

    return () => {
      active = false;
    };
  }, []);

  const totalSeats = guests.reduce((sum, guest) => sum + Number(guestSeats(guest) || 1), 0);
  const sentCount = guests.filter((guest) => ["SENT", "OPENED", "RESPONDED"].includes(guest?.sendStatus)).length;

  if (loading) {
    return (
      <main className="pe-page">
        <section className="pe-board">
          <div className="inv-loading">Loading guests...</div>
        </section>
      </main>
    );
  }

  return (
    <main className="pe-page">
      <section className="pe-board">
        <header className="pe-title-row">
          <div>
            <h1>ការគ្រប់គ្រងភ្ញៀវ</h1>
            <p>{invitation?.title || "Backend guest data"}</p>
          </div>
          <div className="pe-title-stats">
            <span>សរុប {guests.length} នាក់</span>
            <span>កៅអី {totalSeats}</span>
            <span>បានផ្ញើ {sentCount}</span>
          </div>
        </header>

        {error ? (
          <section className="pe-table-shell">
            <div className="pe-empty-state">
              <strong>{error}</strong>
              <Link className="pe-primary-btn" to="/dashboard/invitations/new">
                បង្កើតការអញ្ជើញ
              </Link>
            </div>
          </section>
        ) : (
          <section className="pe-table-shell">
            <div className="pe-toolbar">
              <Link
                className="pe-primary-btn"
                to={`/dashboard/invitations/${invitation.id}/guests`}
              >
                គ្រប់គ្រងលម្អិត
              </Link>
            </div>

            <table className="pe-table">
              <thead>
                <tr>
                  <th>ល.រ</th>
                  <th>ឈ្មោះភ្ញៀវ</th>
                  <th>ទូរស័ព្ទ</th>
                  <th>អ៊ីមែល</th>
                  <th>ក្រុម</th>
                  <th>តុ</th>
                  <th>ស្ថានភាព</th>
                </tr>
              </thead>
              <tbody>
                {guests.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <div className="pe-empty-state">
                        <strong>មិនមានភ្ញៀវ</strong>
                        <span>មិនទាន់មានទិន្នន័យភ្ញៀវសម្រាប់ការអញ្ជើញនេះទេ។</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  guests.map((guest, index) => (
                    <tr key={guest.id || guest.guestId || guest.inviteToken || index}>
                      <td>{index + 1}</td>
                      <td>{guestName(guest)}</td>
                      <td>{guest.phone || "-"}</td>
                      <td>{guest.email || "-"}</td>
                      <td>{guest.guestGroup || guest.group || "-"}</td>
                      <td>{guest.tableNumber || guest.tableName || "-"}</td>
                      <td>{guest.sendStatus || "PENDING"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        )}
      </section>
    </main>
  );
};

export default GuestsPage;
