import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invitationService } from "../../shared/services/invitationService";
import { useLanguageStore } from "../../stores/useLanguageStore";
import "../../features/invitations/InvitationPages.css";

const GUESTS_PAGE_TEXTS = {
  km: {
    loading: "កំពុងទាញយកទិន្នន័យ...",
    noInvitations: "មិនទាន់មានធៀបការទេ",
    noInvitationsDesc: "សូមបង្កើតធៀបការជាមុនសិន ដើម្បីគ្រប់គ្រងបញ្ជីភ្ញៀវរបស់អ្នក។",
    createBtn: "បង្កើតធៀបការ",
  },
  en: {
    loading: "Loading invitations...",
    noInvitations: "No invitations found",
    noInvitationsDesc: "Please create an invitation first to manage your guest list.",
    createBtn: "Create Invitation",
  },
};

const GuestsPage = () => {
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang) || "en";
  const t = GUESTS_PAGE_TEXTS[lang === "km" ? "km" : "en"];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    let active = true;
    invitationService.listMine()
      .then((items) => {
        if (!active) return;
        setInvitations(items || []);
        if (items && items.length > 0) {
          navigate(`/dashboard/invitations/${items[0].id}/guests`, { replace: true });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Could not load invitations");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="inv-page">
        <div className="inv-loading">{t.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inv-page">
        <div className="inv-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="inv-page">
      <div className="inv-empty">
        <h2>{t.noInvitations}</h2>
        <p>{t.noInvitationsDesc}</p>
        <button
          className="inv-primary-btn"
          type="button"
          onClick={() => navigate("/dashboard/invitations/new")}
        >
          {t.createBtn}
        </button>
      </div>
    </div>
  );
};

export default GuestsPage;
