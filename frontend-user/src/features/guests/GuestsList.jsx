import { useEffect, useMemo, useState } from "react";
import { QRCode } from "react-qr-code";
import {
  IoAdd,
  IoCheckmark,
  IoClose,
  IoCloudUploadOutline,
  IoCopyOutline,
  IoDownloadOutline,
  IoEllipsisVertical,
  IoPencilOutline,
  IoPeopleOutline,
  IoQrCodeOutline,
  IoRefreshOutline,
  IoSearch,
  IoSendOutline,
  IoSettingsOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { listRsvps } from "../../services/rsvpService";
import { listDrafts } from "../../services/weddingStorage";
import {
  createHostRecordId,
  getActiveEventId,
  listManualGuests,
  saveManualGuests,
} from "../../services/hostPlanningStorage";
import { guestService } from "../../shared/services/guestService";
import { invitationService } from "../../shared/services/invitationService";
import { useBackendMessages } from "../../shared/i18n/useBackendMessages";
import "./GuestsPage.css";


const DEFAULT_GROUPS = [
  { id: "groom-side", name: "Groom Side", note: "ខាងកូនកំលោះ" },
  { id: "bride-side", name: "Bride Side", note: "ខាងកូនក្រមុំ" },
];

const DEFAULT_CATEGORIES = [
  {
    id: "high-school",
    name: "High School Friend",
    note: "មិត្តភក្តិវិទ្យាល័យ",
  },
  { id: "college", name: "College Friend", note: "មិត្តភក្តិសាកលវិទ្យាល័យ" },
  { id: "friend", name: "Friend", note: "មិត្តភក្តិ" },
  { id: "family", name: "Family", note: "គ្រួសារ" },
  { id: "coworker", name: "Coworker", note: "សហការី" },
  { id: "other", name: "Other", note: "ផ្សេងៗ" },
];

const SEND_STATUS = {
  pending: "មិនទាន់ផ្ញើ",
  sent: "បានផ្ញើ",
  opened: "បានបើក",
  responded: "បានឆ្លើយតប",
};

const emptyGuestForm = {
  name: "",
  companionName: "",
  phone: "",
  group: DEFAULT_GROUPS[0].name,
  category: DEFAULT_CATEGORIES[0].name,
  note: "",
  count: "1",
  seat: "",
  sendStatus: SEND_STATUS.pending,
};

function scopedKey(base, eventId) {
  return eventId ? `${base}.${eventId}` : base;
}

function readList(key, fallback) {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeList(key, list) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // localStorage may be disabled or full.
  }
}

function getResponsesForDraft(draft) {
  if (!draft?.id) return [];

  const responses = new Map();
  listRsvps(draft.id).forEach((entry) => responses.set(entry.id, entry));
  if (draft.slug) {
    listRsvps(draft.slug).forEach((entry) => responses.set(entry.id, entry));
  }
  return Array.from(responses.values());
}

function normalizeManualGuest(guest) {
  const name = guest.name || guest.guestName || "Guest";
  return {
    ...guest,
    id: guest.id || createHostRecordId("guest"),
    name,
    companionName: guest.companionName || "",
    phone: guest.phone === "-" ? "" : guest.phone || "",
    group: guest.group || guest.guestGroup || DEFAULT_GROUPS[0].name,
    category:
      guest.category ||
      guest.sideType ||
      guest.status ||
      DEFAULT_CATEGORIES[0].name,
    sendStatus: guest.sendStatus || SEND_STATUS.pending,
    count: Math.max(1, Number(guest.count) || 1),
    seat: guest.seat === "-" ? "" : guest.seat || "",
    note: guest.note || "",
    source: guest.source || "manual",
  };
}

function normalizeBackendGuest(guest) {
  const name = guest.guestName || guest.name || "Guest";
  const id = guest.id || guest.guestId;
  return {
    id,
    backendId: id,
    raw: guest,
    name,
    companionName: "",
    phone: guest.phone === "-" ? "" : guest.phone || "",
    group: guest.guestGroup || DEFAULT_GROUPS[0].name,
    category: guest.sideType || DEFAULT_CATEGORIES[0].name,
    sendStatus: guest.sendStatus || SEND_STATUS.pending,
    count: Math.max(1, Number(guest.seatCount) || 1),
    seat: guest.tableNumber || "",
    note: guest.note || "",
    inviteToken: guest.inviteToken || "",
    qrCodeUrl: guest.qrCodeUrl || "",
    source: "backend",
  };
}

function toManualGuest(form, existingId) {
  return {
    id: existingId || createHostRecordId("guest"),
    name: form.name.trim(),
    companionName: form.companionName.trim(),
    phone: form.phone.trim(),
    group: form.group,
    category: form.category,
    sendStatus: form.sendStatus,
    amount: "-",
    seat: form.seat.trim(),
    count: Math.max(1, Number(form.count) || 1),
    note: form.note.trim(),
    source: "manual",
    updatedAt: Date.now(),
  };
}

function toBackendGuestPayload(form) {
  return {
    guestName: form.name.trim(),
    phone: form.phone.trim() || null,
    guestGroup: form.group || null,
    sideType: form.category || null,
    tableNumber: form.seat.trim() || null,
    sendStatus: form.sendStatus || null,
    seatCount: Math.max(1, Number(form.count) || 1),
    note: form.note.trim() || null,
  };
}

function backendPayloadFromGuest(guest, overrides = {}) {
  return {
    guestName: overrides.name ?? guest.name ?? guest.raw?.guestName,
    phone: overrides.phone ?? guest.phone ?? guest.raw?.phone ?? null,
    email: guest.raw?.email ?? null,
    guestGroup: overrides.group ?? guest.group ?? guest.raw?.guestGroup ?? null,
    sideType: overrides.category ?? guest.category ?? guest.raw?.sideType ?? null,
    tableNumber: overrides.seat ?? guest.seat ?? guest.raw?.tableNumber ?? null,
    sendStatus: overrides.sendStatus ?? guest.sendStatus ?? guest.raw?.sendStatus ?? null,
    seatCount: overrides.count ?? Math.max(1, Number(guest.count) || Number(guest.raw?.seatCount) || 1),
    note: overrides.note ?? guest.note ?? guest.raw?.note ?? null,
    contributionStatus: guest.raw?.contributionStatus ?? null,
    totalContributed: guest.raw?.totalContributed ?? null,
  };
}

function invitationId(invitation) {
  return invitation?.id || invitation?.invitationId;
}

function pickBackendInvitation(invitations, draft) {
  if (!invitations?.length) return null;

  const draftId = draft?.backendInvitationId || draft?.invitationId || draft?.id;
  return (
    invitations.find((invitation) => String(invitationId(invitation)) === String(draftId)) ||
    invitations.find((invitation) => invitation.slug && invitation.slug === draft?.slug) ||
    invitations.find((invitation) => invitation.status === "PUBLISHED") ||
    invitations.find((invitation) => invitationId(invitation)) ||
    null
  );
}

function initials(name) {
  return (
    (name || "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

function guestInviteUrl(draft, guest, publicInvitation) {
  const base = typeof window === "undefined" ? "" : window.location.origin;

  if (guest?.qrCodeUrl) {
    if (!base) return guest.qrCodeUrl;
    try {
      const url = new URL(guest.qrCodeUrl, base);
      return `${base}${url.pathname}${url.search}${url.hash}`;
    } catch {
      return guest.qrCodeUrl;
    }
  }

  const slug = publicInvitation?.slug || draft?.slug || draft?.id || "invitation";
  const token = guest?.inviteToken;
  const query = token ? `?token=${encodeURIComponent(token)}` : "";
  return `${base}/i/${encodeURIComponent(slug)}${query}`;
}

function pickPublicInvitation(invitations, draft) {
  const published = (invitations || []).filter(
    (invitation) => invitation?.status === "PUBLISHED" && invitation?.slug,
  );

  if (!published.length) return null;

  const draftId = draft?.backendInvitationId || draft?.invitationId || draft?.id;
  return (
    published.find((invitation) => String(invitationId(invitation)) === String(draftId)) ||
    published.find((invitation) => invitation.slug === draft?.slug) ||
    published[0]
  );
}

async function copyText(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-9999px";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(field);
  return copied;
}

function SelectField({
  label,
  value,
  options,
  onChange,
  onManage,
  placeholder,
  manageLabel,
  noDescLabel,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = options.filter((option) => {
    const term = query.trim().toLowerCase();
    const note = option.note || "";
    return (
      !term ||
      option.name.toLowerCase().includes(term) ||
      note.toLowerCase().includes(term)
    );
  });

  return (
    <label className="pe-field pe-select-field">
      <span>{label}</span>
      <button
        type="button"
        className="pe-select-trigger"
        onClick={() => setOpen((next) => !next)}
      >
        <span>{value || placeholder}</span>
        <IoClose className="pe-select-clear" aria-hidden="true" />
      </button>
      {onManage && (
        <button type="button" className="pe-manage-link" onClick={onManage}>
          <IoSettingsOutline aria-hidden="true" />
          {manageLabel || "គ្រប់គ្រង"}
        </button>
      )}
      {open && (
        <div className="pe-select-menu">
          <div className="pe-select-search">
            <IoSearch aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
            />
          </div>
          <div className="pe-select-options">
            {filtered.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`pe-select-option${option.name === value ? " is-active" : ""}`}
                onClick={() => {
                  onChange(option.name);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span className="pe-radio" aria-hidden="true" />
                <span>
                  <strong>{option.name}</strong>
                  <small>{option.note || noDescLabel || "មិនមានពណ៌នា"}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </label>
  );
}

function ManageModal({ title, items, onClose, onSave, t }) {
  const [draftItems, setDraftItems] = useState(items);
  const [form, setForm] = useState({ name: "", note: "" });
  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState({ name: "", note: "" });

  const noDesc = t ? t("managerNoDesc") : "មិនមានពណ៌នា";

  const addItem = () => {
    if (!form.name.trim()) return;
    setDraftItems((current) => [
      ...current,
      {
        id: createHostRecordId("option"),
        name: form.name.trim(),
        note: form.note.trim(),
      },
    ]);
    setForm({ name: "", note: "" });
  };

  const updateEditing = () => {
    if (!editing.name.trim()) return;
    setDraftItems((current) =>
      current.map((item) =>
        item.id === editingId
          ? { ...item, name: editing.name.trim(), note: editing.note.trim() }
          : item,
      ),
    );
    setEditingId(null);
    setEditing({ name: "", note: "" });
  };

  return (
    <div className="pe-modal-layer pe-modal-layer-top">
      <section className="pe-manager-modal">
        <button
          type="button"
          className="pe-modal-x"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose aria-hidden="true" />
        </button>
        <h2>
          <IoSettingsOutline aria-hidden="true" />
          {title}
        </h2>

        <div className="pe-manager-add">
          <label>
            <span>{t ? t("managerFieldName") : "ឈ្មោះ"}</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder={t ? t("managerFieldName") : "បញ្ចូលឈ្មោះ"}
            />
          </label>
          <label>
            <span>{t ? t("managerFieldNote") : "ពណ៌នា"}</span>
            <input
              value={form.note}
              onChange={(event) =>
                setForm((current) => ({ ...current, note: event.target.value }))
              }
              placeholder={t ? t("managerFieldNote") : "បញ្ចូលពណ៌នា"}
            />
          </label>
          <button type="button" className="pe-primary-btn" onClick={addItem}>
            <IoAdd aria-hidden="true" />
            {t ? t("managerAddBtn") : "បន្ថែម"}
          </button>
        </div>

        <h3>{t ? t("managerListTitle", { count: draftItems.length }) : `បញ្ជី (${draftItems.length})`}</h3>
        <div className="pe-manager-list">
          {draftItems.map((item) => {
            const isEditing = item.id === editingId;
            return (
              <article
                key={item.id}
                className={`pe-manager-row${isEditing ? " is-editing" : ""}`}
              >
                {isEditing ? (
                  <>
                    <div className="pe-manager-edit-grid">
                      <label>
                        <span>{t ? t("managerFieldName") : "ឈ្មោះ"}</span>
                        <input
                          value={editing.name}
                          onChange={(event) =>
                            setEditing((current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label>
                        <span>{t ? t("managerFieldNote") : "ពណ៌នា"}</span>
                        <input
                          value={editing.note}
                          onChange={(event) =>
                            setEditing((current) => ({
                              ...current,
                              note: event.target.value,
                            }))
                          }
                        />
                      </label>
                    </div>
                    <div className="pe-manager-actions">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        aria-label="Cancel"
                      >
                        <IoClose aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={updateEditing}
                        aria-label="Save"
                      >
                        <IoCheckmark aria-hidden="true" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="pe-row-icon">
                      <IoPeopleOutline aria-hidden="true" />
                    </span>
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.note || noDesc}</small>
                    </div>
                    <div className="pe-manager-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditing({
                            name: item.name,
                            note: item.note || "",
                          });
                        }}
                        aria-label="Edit"
                      >
                        <IoPencilOutline aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraftItems((current) =>
                            current.filter((entry) => entry.id !== item.id),
                          )
                        }
                        aria-label="Delete"
                      >
                        <IoTrashOutline aria-hidden="true" />
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>

        <div className="pe-manager-footer">
          <button type="button" className="pe-secondary-btn" onClick={onClose}>
            {t ? t("cancel") : "បោះបង់"}
          </button>
          <button
            type="button"
            className="pe-primary-btn"
            onClick={() => onSave(draftItems)}
          >
            <IoCheckmark aria-hidden="true" />
            {t ? t("managerSave") : "រក្សាទុក"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function GuestsList() {
  const { text: t } = useBackendMessages("guests");
  const drafts = useMemo(() => listDrafts(), []);
  const activeEventId = getActiveEventId();
  const currentDraft =
    drafts.find((draft) => draft.id === activeEventId) || drafts[0] || null;
  const eventId = currentDraft?.id || activeEventId || "";

  const [manualGuests, setManualGuests] = useState(() =>
    listManualGuests(eventId).map(normalizeManualGuest),
  );
  const [groups, setGroups] = useState(() =>
    readList(scopedKey("koupreng.host.guestGroups", eventId), DEFAULT_GROUPS),
  );
  const [categories, setCategories] = useState(() =>
    readList(
      scopedKey("koupreng.host.guestCategories", eventId),
      DEFAULT_CATEGORIES,
    ),
  );
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [form, setForm] = useState(emptyGuestForm);
  const [editingId, setEditingId] = useState(null);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [managerType, setManagerType] = useState(null);
  const [linkGuestId, setLinkGuestId] = useState(null);
  const [menuGuestId, setMenuGuestId] = useState(null);
  const [qrGuest, setQrGuest] = useState(null);
  const [toast, setToast] = useState("");
  const [publicInvitation, setPublicInvitation] = useState(null);
  const [backendInvitation, setBackendInvitation] = useState(null);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadGuests() {
      setBackendLoading(true);
      setBackendError("");

      try {
        const publishedItems = await invitationService.listMine("PUBLISHED");
        const publishedInvitation = pickBackendInvitation(publishedItems || [], currentDraft);
        const allItems = publishedInvitation ? publishedItems : await invitationService.listMine();
        if (!active) return;

        const selectedInvitation = publishedInvitation || pickBackendInvitation(allItems || [], currentDraft);
        const selectedInvitationId = invitationId(selectedInvitation);
        const invitationsForPublicLink = allItems || publishedItems || [];
        setBackendInvitation(selectedInvitation);
        setPublicInvitation(pickPublicInvitation(invitationsForPublicLink, selectedInvitation || currentDraft));

        if (!selectedInvitationId) {
          setManualGuests(listManualGuests(eventId).map(normalizeManualGuest));
          return;
        }

        const backendGuests = await guestService.listByInvitation(selectedInvitationId);
        if (!active) return;
        setManualGuests((backendGuests || []).map(normalizeBackendGuest));
      } catch (err) {
        if (active) {
          setBackendInvitation(null);
          setPublicInvitation(null);
          setBackendError(err.message || "Could not load guests from backend");
          setManualGuests(listManualGuests(eventId).map(normalizeManualGuest));
        }
      } finally {
        if (active) {
          setBackendLoading(false);
        }
      }
    }

    loadGuests();

    return () => {
      active = false;
    };
  }, [currentDraft, eventId]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const rsvpGuests = useMemo(
    () =>
      backendInvitation
        ? []
        : getResponsesForDraft(currentDraft).map((entry) => ({
        id: entry.id,
        name: entry.name || entry.guestName || "RSVP Guest",
        companionName: "",
        phone: entry.phone || "",
        group: "RSVP",
        category: "RSVP",
        sendStatus: SEND_STATUS.responded,
        amount: "-",
        seat: "",
        count: Number(entry.count) || 1,
        note: entry.message || "",
        source: "rsvp",
      })),
    [backendInvitation, currentDraft],
  );

  const allGuests = useMemo(
    () => [...manualGuests, ...rsvpGuests],
    [manualGuests, rsvpGuests],
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return allGuests.filter((guest) => {
      const haystack = [
        guest.name,
        guest.companionName,
        guest.phone,
        guest.group,
        guest.category,
        guest.note,
      ]
        .join(" ")
        .toLowerCase();
      const matchSearch = !keyword || haystack.includes(keyword);
      const matchGroup = !groupFilter || guest.group === groupFilter;
      const matchCategory =
        !categoryFilter || guest.category === categoryFilter;
      return matchSearch && matchGroup && matchCategory;
    });
  }, [allGuests, categoryFilter, groupFilter, search]);

  const selectedCount = selectedIds.length;
  const totalSeats = allGuests.reduce(
    (total, guest) => total + (Number(guest.count) || 1),
    0,
  );
  const sentCount = allGuests.filter(
    (guest) =>
      guest.sendStatus === SEND_STATUS.sent ||
      guest.sendStatus === SEND_STATUS.opened,
  ).length;
  const backendInvitationId = invitationId(backendInvitation);

  const persistManualGuests = (nextGuests) => {
    setManualGuests(nextGuests);
    if (!backendInvitationId) {
      saveManualGuests(nextGuests, eventId);
    }
  };

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      ...emptyGuestForm,
      group: groups[0]?.name || DEFAULT_GROUPS[0].name,
      category: categories[0]?.name || DEFAULT_CATEGORIES[0].name,
    });
    setGuestModalOpen(true);
  };

  const openEditModal = (guest) => {
    if (guest.source === "rsvp") return;
    setEditingId(guest.id);
    setForm({
      name: guest.name || "",
      companionName: guest.companionName || "",
      phone: guest.phone || "",
      group: guest.group || groups[0]?.name || DEFAULT_GROUPS[0].name,
      category:
        guest.category || categories[0]?.name || DEFAULT_CATEGORIES[0].name,
      note: guest.note || "",
      count: String(guest.count || 1),
      seat: guest.seat || "",
      sendStatus: guest.sendStatus || SEND_STATUS.pending,
    });
    setGuestModalOpen(true);
    setMenuGuestId(null);
  };

  const closeGuestModal = () => {
    setGuestModalOpen(false);
    setEditingId(null);
    setForm(emptyGuestForm);
    setManagerType(null);
  };

  const submitGuest = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || saving) return;

    setSaving(true);
    try {
      if (backendInvitationId) {
        if (editingId) {
          const updated = await guestService.updateForInvitation(
            backendInvitationId,
            editingId,
            toBackendGuestPayload(form),
          );
          setManualGuests((current) =>
            current.map((guest) =>
              guest.id === editingId ? normalizeBackendGuest(updated) : guest,
            ),
          );
        } else {
          const created = await guestService.createForInvitation(
            backendInvitationId,
            toBackendGuestPayload(form),
          );
          setManualGuests((current) => [normalizeBackendGuest(created), ...current]);
        }
      } else {
        const nextGuest = toManualGuest(form, editingId);
        const nextGuests = editingId
          ? manualGuests.map((guest) =>
            guest.id === editingId ? nextGuest : guest,
          )
          : [nextGuest, ...manualGuests];
        persistManualGuests(nextGuests);
      }

      setToast(editingId ? t("toastUpdated") : t("toastAdded"));
      closeGuestModal();
    } catch (err) {
      setToast(err.message || "Could not save guest");
    } finally {
      setSaving(false);
    }
  };

  const deleteGuest = async (guestId) => {
    if (saving) return;

    const target = manualGuests.find((guest) => guest.id === guestId);
    setSaving(true);
    try {
      if (backendInvitationId && target?.source === "backend") {
        await guestService.removeFromInvitation(backendInvitationId, guestId);
      }
      const nextGuests = manualGuests.filter((guest) => guest.id !== guestId);
      persistManualGuests(nextGuests);
      setSelectedIds((current) => current.filter((id) => id !== guestId));
      setMenuGuestId(null);
      setToast(t("toastDeleted"));
    } catch (err) {
      setToast(err.message || "Could not delete guest");
    } finally {
      setSaving(false);
    }
  };

  const deleteSelectedGuests = async () => {
    if (!selectedIds.length || saving) return;

    const selectedSet = new Set(selectedIds);
    const selectedGuests = manualGuests.filter((guest) => selectedSet.has(guest.id));
    setSaving(true);
    try {
      if (backendInvitationId) {
        await Promise.all(
          selectedGuests
            .filter((guest) => guest.source === "backend")
            .map((guest) => guestService.removeFromInvitation(backendInvitationId, guest.id)),
        );
      }
      const nextGuests = manualGuests.filter(
        (guest) => !selectedSet.has(guest.id),
      );
      persistManualGuests(nextGuests);
      setSelectedIds([]);
      setToast(t("toastDeleteSelected"));
    } catch (err) {
      setToast(err.message || "Could not delete selected guests");
    } finally {
      setSaving(false);
    }
  };

  const toggleSelected = (guestId) => {
    setSelectedIds((current) =>
      current.includes(guestId)
        ? current.filter((id) => id !== guestId)
        : [...current, guestId],
    );
  };

  const toggleAll = () => {
    const selectableIds = filtered.map((guest) => guest.id);
    setSelectedIds((current) =>
      selectableIds.every((id) => current.includes(id)) ? [] : selectableIds,
    );
  };

  const saveGroups = (nextGroups) => {
    setGroups(nextGroups);
    writeList(scopedKey("koupreng.host.guestGroups", eventId), nextGroups);
    if (!nextGroups.some((group) => group.name === form.group)) {
      updateForm("group", nextGroups[0]?.name || "");
    }
    setManagerType(null);
  };

  const saveCategories = (nextCategories) => {
    setCategories(nextCategories);
    writeList(
      scopedKey("koupreng.host.guestCategories", eventId),
      nextCategories,
    );
    if (!nextCategories.some((category) => category.name === form.category)) {
      updateForm("category", nextCategories[0]?.name || "");
    }
    setManagerType(null);
  };

  const markSent = async (guest) => {
    if (guest.source === "backend" && backendInvitationId) {
      setSaving(true);
      try {
        const updated = await guestService.updateForInvitation(
          backendInvitationId,
          guest.id,
          backendPayloadFromGuest(guest, { sendStatus: SEND_STATUS.sent }),
        );
        setManualGuests((current) =>
          current.map((item) =>
            item.id === guest.id ? normalizeBackendGuest(updated) : item,
          ),
        );
      } catch (err) {
        setToast(err.message || "Could not update send status");
      } finally {
        setSaving(false);
      }
    } else if (guest.source === "manual") {
      const nextGuests = manualGuests.map((item) =>
        item.id === guest.id
          ? { ...item, sendStatus: SEND_STATUS.sent, updatedAt: Date.now() }
          : item,
      );
      persistManualGuests(nextGuests);
    }
    setLinkGuestId(guest.id);
    setMenuGuestId(null);
    setToast(t("toastLinkReady"));
  };

  const openQr = (guest) => {
    setQrGuest(guest);
    setLinkGuestId(null);
    setMenuGuestId(null);
  };

  const downloadQr = () => {
    const svg = document.querySelector(".pe-qr-code svg");
    if (!svg || !qrGuest) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${qrGuest.name || "guest"}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToast(t("toastQrDownloaded"));
  };

  const copyInvite = async (guest) => {
    await copyText(guestInviteUrl(currentDraft, guest, publicInvitation));
    setToast(t("toastCopied"));
  };

  const copySelectedInvites = async () => {
    const selectedGuests = allGuests.filter((guest) =>
      selectedIds.includes(guest.id),
    );
    if (!selectedGuests.length) return;
    const links = selectedGuests
      .map((guest) => `${guest.name}: ${guestInviteUrl(currentDraft, guest, publicInvitation)}`)
      .join("\n");
    await copyText(links);
    setToast(t("toastCopiedSelected"));
  };

  return (
    <main className="pe-page">
      {toast && (
        <div className="pe-toast" role="status">
          <IoCheckmark aria-hidden="true" />
          {toast}
        </div>
      )}

      <section className="pe-board">
        <header className="pe-title-row">
          <div>
            <h1>{t("title")}</h1>
            <p>
              <IoPeopleOutline aria-hidden="true" />
              {backendLoading ? "..." : allGuests.length}/{Math.max(20, allGuests.length)}
            </p>
          </div>
          <div className="pe-title-stats">
            <span>{t("totalSeats", { count: totalSeats })}</span>
            <span>{t("sent", { count: sentCount })}</span>
          </div>
        </header>

        {backendError && (
          <div className="pe-empty" role="status">
            <IoPeopleOutline aria-hidden="true" />
            <strong>{backendError}</strong>
            <span>Showing local guest data instead.</span>
          </div>
        )}

        <section className="pe-table-shell">
          <div className="pe-toolbar">
            <label className="pe-search">
              <IoSearch aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("searchPlaceholder")}
              />
            </label>

            <select
              value={groupFilter}
              onChange={(event) => setGroupFilter(event.target.value)}
            >
              <option value="">{t("filterGroup")}</option>
              {groups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="">{t("filterStatus")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="pe-icon-filter"
              onClick={copySelectedInvites}
              disabled={!selectedCount}
              aria-label="Copy selected"
            >
              <IoCopyOutline aria-hidden="true" />
            </button>

            <div className="pe-toolbar-spacer" />

            <div className="pe-excel-group">
              <button
                type="button"
                className="pe-excel-btn"
                onClick={() => alert("Upload Excel coming soon!")}
                disabled={saving}
              >
                <IoCloudUploadOutline aria-hidden="true" />
                {t ? t("importExcel") || "បញ្ចូល Excel" : "បញ្ចូល Excel"}
              </button>
              <button
                type="button"
                className="pe-excel-btn"
                onClick={() => alert("Download coming soon!")}
                disabled={saving}
              >
                <IoDownloadOutline aria-hidden="true" />
                {t ? t("Export") || "ទាញយក" : "ទាញយក"}
              </button>
            </div>

            <button
              type="button"
              className="pe-primary-btn"
              onClick={openCreateModal}
              disabled={saving || backendLoading}
            >
              <IoAdd aria-hidden="true" />
              {t("addGuest")}
            </button>
            <button
              type="button"
              className="pe-danger-soft"
              onClick={deleteSelectedGuests}
              disabled={!selectedCount || saving}
            >
              <IoTrashOutline aria-hidden="true" />
              {t("delete")}
            </button>
          </div>

          <div className="pe-table-wrap">
            <table className="pe-table">
              <thead>
                <tr>
                  <th className="pe-check-col">
                    <input
                      type="checkbox"
                      checked={
                        filtered.length > 0 &&
                        filtered.every((guest) =>
                          selectedIds.includes(guest.id),
                        )
                      }
                      onChange={toggleAll}
                      aria-label="Select all guests"
                    />
                  </th>
                  <th>{t("colName")}</th>
                  <th>{t("colPhone")}</th>
                  <th>{t("colGroup")}</th>
                  <th>{t("colStatus")}</th>
                  <th>{t("colSendStatus")}</th>
                  <th>{t("colNote")}</th>
                  <th className="pe-action-head">{t("colActions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((guest) => {
                  const inviteUrl = guestInviteUrl(currentDraft, guest, publicInvitation);
                  return (
                    <tr key={guest.id}>
                      <td className="pe-check-col">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(guest.id)}
                          onChange={() => toggleSelected(guest.id)}
                          aria-label={`Select ${guest.name}`}
                        />
                      </td>
                      <td>
                        <div className="pe-name-cell">
                          <span className="pe-avatar">
                            {initials(guest.name)}
                          </span>
                          <div>
                            <strong>{guest.name}</strong>
                            {guest.companionName && (
                              <small>{guest.companionName}</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{guest.phone || "N/A"}</td>
                      <td>
                        <span className="pe-chip pe-chip-red">
                          {guest.group}
                        </span>
                      </td>
                      <td>
                        <span className="pe-chip">{guest.category}</span>
                      </td>
                      <td>{guest.sendStatus || SEND_STATUS.pending}</td>
                      <td>{guest.note || guest.seat || "N/A"}</td>
                      <td>
                        <div className="pe-actions">
                          <button
                            type="button"
                            onClick={() => markSent(guest)}
                            aria-label="Send link"
                          >
                            <IoSendOutline aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openQr(guest)}
                            aria-label="Show QR"
                          >
                            <IoQrCodeOutline aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setMenuGuestId((current) =>
                                current === guest.id ? null : guest.id,
                              )
                            }
                            aria-label="More actions"
                          >
                            <IoEllipsisVertical aria-hidden="true" />
                          </button>

                          {linkGuestId === guest.id && (
                            <div className="pe-link-popover">
                              <h3>{t("linkTitle")}</h3>
                              <textarea value={inviteUrl} readOnly />
                              <div>
                                <button
                                  type="button"
                                  onClick={() => copyInvite(guest)}
                                  aria-label="Copy link"
                                >
                                  <IoCopyOutline aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openQr(guest)}
                                  aria-label="Download QR"
                                >
                                  <IoDownloadOutline aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLinkGuestId(null)}
                                  aria-label="Close"
                                >
                                  <IoRefreshOutline aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          )}

                          {menuGuestId === guest.id && (
                            <div className="pe-row-menu">
                              <button
                                type="button"
                                onClick={() => openEditModal(guest)}
                              >
                                <IoPencilOutline aria-hidden="true" />
                                {t("editMenuItem")}
                              </button>
                              {guest.source !== "rsvp" && (
                                <button
                                  type="button"
                                  className="is-danger"
                                  onClick={() => deleteGuest(guest.id)}
                                >
                                  <IoTrashOutline aria-hidden="true" />
                                  {t("deleteMenuItem")}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="pe-empty">
                <IoPeopleOutline aria-hidden="true" />
                <strong>{t("empty")}</strong>
                <span>{t("emptyNote")}</span>
              </div>
            )}
          </div>

          <footer className="pe-pagination">
            <strong>
              {t("totalRecords", { count: filtered.length })}
            </strong>
            <div>
              <span>{t("perPage")}</span>
              <button type="button">10</button>
            </div>
            <span>{t("page", { page: 1, total: 1 })}</span>
            <div className="pe-page-buttons">
              <button type="button" disabled>
                «
              </button>
              <button type="button" disabled>
                ‹
              </button>
              <button type="button" disabled>
                ›
              </button>
              <button type="button" disabled>
                »
              </button>
            </div>
          </footer>
        </section>
      </section>

      {guestModalOpen && (
        <div className="pe-modal-layer">
          <form className="pe-guest-modal" onSubmit={submitGuest}>
            <button
              type="button"
              className="pe-modal-x"
              onClick={closeGuestModal}
              aria-label="Close"
            >
              <IoClose aria-hidden="true" />
            </button>
            <h2>{editingId ? t("editGuest") : t("addGuestModal")}</h2>
            <p>{t("guestFormDesc")}</p>

            <div className="pe-form-grid">
              <label className="pe-field">
                <span>
                  {t("fieldName")} <em>*</em>
                </span>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="Ny Panha"
                  required
                />
              </label>
              <label className="pe-field">
                <span>{t("fieldCompanion")}</span>
                <input
                  value={form.companionName}
                  onChange={(event) =>
                    updateForm("companionName", event.target.value)
                  }
                  placeholder={t("placeholderCompanion")}
                />
              </label>

              <SelectField
                label={t("fieldGroup")}
                value={form.group}
                options={groups}
                onChange={(value) => updateForm("group", value)}
                onManage={() => setManagerType("groups")}
                placeholder={t("selectGroup")}
                manageLabel={t("manage")}
                noDescLabel={t("managerNoDesc")}
              />

              <SelectField
                label={t("fieldCategory")}
                value={form.category}
                options={categories}
                onChange={(value) => updateForm("category", value)}
                onManage={() => setManagerType("categories")}
                placeholder={t("selectCategory")}
                manageLabel={t("manage")}
                noDescLabel={t("managerNoDesc")}
              />

              <label className="pe-field">
                <span>{t("fieldPhone")}</span>
                <input
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                  placeholder={t("placeholderPhone")}
                />
              </label>
              <label className="pe-field">
                <span>{t("fieldCount")}</span>
                <input
                  type="number"
                  min="1"
                  value={form.count}
                  onChange={(event) => updateForm("count", event.target.value)}
                />
              </label>
              <label className="pe-field">
                <span>{t("fieldSeat")}</span>
                <input
                  value={form.seat}
                  onChange={(event) => updateForm("seat", event.target.value)}
                  placeholder={t("placeholderSeat")}
                />
              </label>
              <label className="pe-field">
                <span>{t("fieldSendStatus")}</span>
                <select
                  value={form.sendStatus}
                  onChange={(event) =>
                    updateForm("sendStatus", event.target.value)
                  }
                >
                  {Object.values(SEND_STATUS).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="pe-field pe-field-wide">
                <span>{t("fieldNote")}</span>
                <textarea
                  value={form.note}
                  onChange={(event) => updateForm("note", event.target.value)}
                  placeholder={t("placeholderNote")}
                />
              </label>
            </div>

            <div className="pe-modal-footer">
              <button
                type="button"
                className="pe-secondary-btn"
                onClick={closeGuestModal}
              >
                <IoClose aria-hidden="true" />
                {t("cancel")}
              </button>
              <button type="submit" className="pe-primary-btn" disabled={saving}>
                <IoCheckmark aria-hidden="true" />
                {t("submit")}
              </button>
            </div>
          </form>

          {managerType === "groups" && (
            <ManageModal
              title={t("manageGroups")}
              items={groups}
              onClose={() => setManagerType(null)}
              onSave={saveGroups}
              t={t}
            />
          )}
          {managerType === "categories" && (
            <ManageModal
              title={t("manageCategories")}
              items={categories}
              onClose={() => setManagerType(null)}
              onSave={saveCategories}
              t={t}
            />
          )}
        </div>
      )}

      {qrGuest && (
        <div className="pe-modal-layer">
          <section className="pe-qr-modal">
            <button
              type="button"
              className="pe-modal-x"
              onClick={() => setQrGuest(null)}
              aria-label="Close"
            >
              <IoClose aria-hidden="true" />
            </button>
            <h2>{t("qrTitle")}</h2>
            <div className="pe-qr-card">
              <div className="pe-qr-code">
                <QRCode
                  value={guestInviteUrl(currentDraft, qrGuest, publicInvitation)}
                  size={174}
                  level="M"
                />
              </div>
              <strong>{qrGuest.name}</strong>
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                className="pe-secondary-btn pe-qr-download"
                onClick={() => copyInvite(qrGuest)}
              >
                <IoCopyOutline aria-hidden="true" />
                {t("qrCopyLink")}
              </button>
              <button
                type="button"
                className="pe-secondary-btn pe-qr-download"
                onClick={downloadQr}
              >
                <IoDownloadOutline aria-hidden="true" />
                {t("qrDownload")}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
