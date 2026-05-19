/**
 * Dress code color combos for wedding invitations.
 * Each combo has a name and 4 swatches (hex colors).
 */
export const DRESS_CODE_COMBOS = [
    {
        id: "champagne",
        name: "មាស និង ស",
        description: "ពណ៌មាស ស និងត្នោតស្រាល សមសម្រាប់ថតរូបជុំគ្នា។",
        colors: [
            { hex: "#D4AF37", name: "មាស" },
            { hex: "#F5E6D3", name: "ស" },
            { hex: "#B0926A", name: "ត្នោតស្រាល" },
            { hex: "#8B6F47", name: "ត្នោតចាស់" },
        ],
    },
    {
        id: "rose",
        name: "ផ្កាកុលាប",
        description: "ពណ៌ផ្កាកុលាប ស និងមាសផ្កាកុលាប។",
        colors: [
            { hex: "#E8B4B8", name: "ផ្កាកុលាប" },
            { hex: "#F5E6E8", name: "ផ្កាកុលាបស្រាល" },
            { hex: "#B76E79", name: "មាសផ្កាកុលាប" },
            { hex: "#8B4F5C", name: "ផ្កាកុលាបចាស់" },
        ],
    },
    {
        id: "emerald",
        name: "បៃតង និង មាស",
        description: "ពណ៌បៃតងព្រៃ និងមាស សមរម្យសម្រាប់ពិធីបុរាណ។",
        colors: [
            { hex: "#0F5132", name: "បៃតងព្រៃ" },
            { hex: "#2D6A4F", name: "បៃតង" },
            { hex: "#D4AF37", name: "មាស" },
            { hex: "#F5E6D3", name: "ស" },
        ],
    },
    {
        id: "royal",
        name: "ខៀវ​រាជវង្ស",
        description: "ពណ៌ខៀវរាជវង្ស និងប្រាក់ ប្រណីត។",
        colors: [
            { hex: "#1E3A5F", name: "ខៀវរាជវង្ស" },
            { hex: "#3B5998", name: "ខៀវ" },
            { hex: "#C0C0C0", name: "ប្រាក់" },
            { hex: "#F5F5F5", name: "ស" },
        ],
    },
    {
        id: "sunset",
        name: "ថ្ងៃលិច",
        description: "ពណ៌ក្រហមទឹកក្រូច និងមាស រស់រវើក។",
        colors: [
            { hex: "#FF6B35", name: "ទឹកក្រូច" },
            { hex: "#F77F00", name: "លឿងទឹកក្រូច" },
            { hex: "#FCBF49", name: "មាសភ្លឺ" },
            { hex: "#EAE2B7", name: "ក្រែម" },
        ],
    },
    {
        id: "lavender",
        name: "ស្វាយ ស្រាល",
        description: "ពណ៌ស្វាយ និងមាស ទន់ភ្លន់។",
        colors: [
            { hex: "#9B7EBD", name: "ស្វាយ" },
            { hex: "#D4B5E8", name: "ស្វាយស្រាល" },
            { hex: "#E8D5F2", name: "ស្វាយខ្ចី" },
            { hex: "#D4AF37", name: "មាស" },
        ],
    },
    {
        id: "midnight",
        name: "យប់ខ្មៅ",
        description: "ពណ៌ខ្មៅ មាស និងស ប្រណីត។",
        colors: [
            { hex: "#1A1A2E", name: "ខ្មៅ" },
            { hex: "#16213E", name: "ខៀវយប់" },
            { hex: "#D4AF37", name: "មាស" },
            { hex: "#F5F5F5", name: "ស" },
        ],
    },
    {
        id: "tropical",
        name: "ត្រូពិច",
        description: "ពណ៌បៃតងស្លឹក និងមាស កក់ក្ដៅ។",
        colors: [
            { hex: "#06A77D", name: "បៃតងស្លឹក" },
            { hex: "#7FBC8C", name: "បៃតងស្រាល" },
            { hex: "#FFC857", name: "លឿងមាស" },
            { hex: "#FFF1D0", name: "ក្រែម" },
        ],
    },
];

export function getDressCodeCombo(id) {
    return DRESS_CODE_COMBOS.find((c) => c.id === id) || DRESS_CODE_COMBOS[0];
}
