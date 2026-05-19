export default function CoupleInfoStep({ draft, updateField }) {
    return (
        <div>
            <h2>2. ព័ត៌មានគូរ</h2>
            <p className="wb-help">បំពេញឈ្មោះកូនកំលោះ និងកូនក្រមុំ។</p>

            <div className="wb-row">
                <div className="wb-field">
                    <label htmlFor="groom">ឈ្មោះកូនកំលោះ</label>
                    <input
                        id="groom"
                        type="text"
                        value={draft.couple.groom}
                        onChange={(e) => updateField("couple", { groom: e.target.value })}
                        placeholder="បញ្ញា"
                    />
                </div>
                <div className="wb-field">
                    <label htmlFor="bride">ឈ្មោះកូនក្រមុំ</label>
                    <input
                        id="bride"
                        type="text"
                        value={draft.couple.bride}
                        onChange={(e) => updateField("couple", { bride: e.target.value })}
                        placeholder="ផ្កាយ"
                    />
                </div>
            </div>
        </div>
    );
}
