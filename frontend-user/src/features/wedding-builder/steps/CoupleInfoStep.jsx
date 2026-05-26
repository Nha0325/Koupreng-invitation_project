/**
 * CoupleInfoStep — Step 2: ព័ត៌មានគូរ
 * Groom & Bride names
 */
export default function CoupleInfoStep({ draft, updateField }) {
    const couple = draft?.couple || { groom: "", bride: "" };

    return (
        <div>
            <h2>2. ព័ត៌មានគូរ</h2>
            <p className="wb-help">បំពេញឈ្មោះកូនកំលោះ និងកូនក្រមុំ។</p>

            <div className="wb-row">
                <div className="wb-field">
                    <label>ឈ្មោះកូនកំលោះ</label>
                    <input
                        type="text"
                        value={couple.groom}
                        onChange={(e) => updateField("couple", { groom: e.target.value })}
                        placeholder="ឧ. បញ្ញា"
                    />
                </div>
                <div className="wb-field">
                    <label>ឈ្មោះកូនក្រមុំ</label>
                    <input
                        type="text"
                        value={couple.bride}
                        onChange={(e) => updateField("couple", { bride: e.target.value })}
                        placeholder="ឧ. ផ្កាយ"
                    />
                </div>
            </div>
        </div>
    );
}
