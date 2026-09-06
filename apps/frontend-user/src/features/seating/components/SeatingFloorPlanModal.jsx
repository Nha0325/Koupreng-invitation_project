import { useEffect } from "react";
import { IoCloseOutline, IoRestaurantOutline, IoSparkles } from "react-icons/io5";
import { SeatingFloorPlan } from "./SeatingFloorPlan";
import "./SeatingFloorPlan.css";

export function SeatingFloorPlanModal({
    isOpen,
    onClose,
    tables = [],
    guestTable = "",
    guestSeat = "",
    venueName = "",
    invitationId = null,
}) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="sfp-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="sfp-modal-dialog" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sfp-modal-head">
                    <div>
                        <h3>
                            <IoSparkles style={{ color: "#b98b42", marginRight: "6px" }} />
                            ប្លង់ទីតាំងតុក្នុងសាលការ (Venue Seating Plan)
                        </h3>
                        <p>
                            {venueName ? `${venueName} • ` : ""}
                            {guestTable ? (
                                <span style={{ color: "#b98b42", fontWeight: 700 }}>
                                    តុរបស់អ្នក៖ {guestTable} {guestSeat ? `(${guestSeat})` : ""}
                                </span>
                            ) : (
                                "សូមពិនិត្យមើលទីតាំងតុនីមួយៗក្នុងសាលមង្គលការ"
                            )}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="sfp-modal-close"
                        onClick={onClose}
                        aria-label="បិទ"
                    >
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Body */}
                <div className="sfp-modal-body">
                    {tables.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 20px", color: "#7d6443" }}>
                            <IoRestaurantOutline style={{ fontSize: "2.5rem", opacity: 0.5, marginBottom: "8px" }} />
                            <p style={{ fontWeight: 700 }}>មិនទាន់មានទិន្នន័យប្លង់តុនៅឡើយទេ</p>
                        </div>
                    ) : (
                        <SeatingFloorPlan
                            tables={tables}
                            readOnly={true}
                            highlightTableName={guestTable}
                            invitationId={invitationId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SeatingFloorPlanModal;
