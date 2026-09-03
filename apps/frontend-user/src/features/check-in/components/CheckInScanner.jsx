import { useState } from "react";
import { LoadingButton } from "@/shared/ui";

export function CheckInScanner({ scanning, onScan, lastScanned }) {
  const [tokenInput, setTokenInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    onScan(tokenInput.trim()).then(() => {
      setTokenInput("");
    });
  };

  return (
    <div className="checkin-scanner-box">
      <form onSubmit={handleSubmit} className="checkin-scanner-form">
        <input
          type="text"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="បញ្ចូល Token ឬស្កេន Guest QR Code នៅទីនេះ..."
          className="checkin-token-input"
          disabled={scanning}
        />
        <LoadingButton
          type="submit"
          className="dash-btn dash-btn-primary"
          isLoading={scanning}
          disabled={!tokenInput.trim()}
        >
          Check-In ភ្ញៀវ
        </LoadingButton>
      </form>

      {lastScanned && (
        <div className="checkin-last-success">
          ✅ <strong>{lastScanned.guestName || "Guest"}</strong> បាន Check-In ជោគជ័យ!
        </div>
      )}
    </div>
  );
}

export default CheckInScanner;
