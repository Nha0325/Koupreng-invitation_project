import { useState } from "react";
import { DRESS_CODE_COMBOS } from "../../../shared/data/dressCodeColors";
import "./DressCodePicker.css";

/**
 * DressCodePicker — choose a predefined color combo or build a custom one.
 * Emits: { id, name, description, colors: [{hex, name}, ...] }
 */
export function DressCodePicker({ value, onChange }) {
    const [mode, setMode] = useState(value?.id === "custom" ? "custom" : "preset");

    const selectedId = value?.id || "champagne";
    const customColors = value?.id === "custom" ? value.colors : [
        { hex: "#D4AF37", name: "ពណ៌ ១" },
        { hex: "#F5E6D3", name: "ពណ៌ ២" },
        { hex: "#B0926A", name: "ពណ៌ ៣" },
        { hex: "#8B6F47", name: "ពណ៌ ៤" },
    ];

    const selectPreset = (combo) => {
        setMode("preset");
        onChange(combo);
    };

    const updateCustomColor = (index, key, val) => {
        const newColors = customColors.map((c, i) => i === index ? { ...c, [key]: val } : c);
        onChange({
            id: "custom",
            name: "ពណ៌ផ្ទាល់ខ្លួន",
            description: "ពណ៌ដែលបានកំណត់ដោយខ្លួនឯង។",
            colors: newColors,
        });
    };

    return (
        <div className="dcp-wrap">
            <div className="dcp-tabs">
                <button
                    type="button"
                    className={`dcp-tab${mode === "preset" ? " active" : ""}`}
                    onClick={() => setMode("preset")}
                >
                    ពណ៌ស្តង់ដារ
                </button>
                <button
                    type="button"
                    className={`dcp-tab${mode === "custom" ? " active" : ""}`}
                    onClick={() => {
                        setMode("custom");
                        onChange({
                            id: "custom",
                            name: "ពណ៌ផ្ទាល់ខ្លួន",
                            description: "ពណ៌ដែលបានកំណត់ដោយខ្លួនឯង។",
                            colors: customColors,
                        });
                    }}
                >
                    ពណ៌ផ្ទាល់ខ្លួន
                </button>
            </div>

            {mode === "preset" && (
                <div className="dcp-grid">
                    {DRESS_CODE_COMBOS.map((combo) => (
                        <button
                            key={combo.id}
                            type="button"
                            className={`dcp-combo${selectedId === combo.id ? " selected" : ""}`}
                            onClick={() => selectPreset(combo)}
                        >
                            <div className="dcp-swatches">
                                {combo.colors.map((c, i) => (
                                    <span key={i} style={{ background: c.hex }} />
                                ))}
                            </div>
                            <div className="dcp-combo-name">{combo.name}</div>
                        </button>
                    ))}
                </div>
            )}

            {mode === "custom" && (
                <div className="dcp-custom">
                    {customColors.map((c, i) => (
                        <div key={i} className="dcp-custom-row">
                            <input
                                type="color"
                                className="dcp-color-input"
                                value={c.hex}
                                onChange={(e) => updateCustomColor(i, "hex", e.target.value)}
                            />
                            <input
                                type="text"
                                className="dcp-name-input"
                                value={c.name}
                                onChange={(e) => updateCustomColor(i, "name", e.target.value)}
                                placeholder={`ពណ៌ ${i + 1}`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DressCodePicker;
