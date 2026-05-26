# 📅 ដំណាក់កាល "ព័ត៌មានពិធី" (EventInfoStep)

## ទីតាំងក្នុង Builder Flow

- Step index: **2** (ទីបី) ក្នុង `BUILDER_STEPS`
- ID: `event`
- Label: `ព័ត៌មានពិធី`
- File: `steps/EventInfoStep.jsx`
- CSS: `steps/EventInfoStep.css`

## UI Design — Card-Based Layout

### រចនាសម្ព័ន្ធ (Structure)

```
┌─────────────────────────────────────┐
│  ព័ត៌មានពិធី (Header)               │
│  បំពេញព័ត៌មានអំពីកាលបរិច្ឆេទ...     │
├─────────────────────────────────────┤
│  📅 កាលបរិច្ឆេទ និងពេលវេលា         │
│  ┌───────────────────────────────┐  │
│  │ កាលបរិច្ឆេទពិធី [DatePicker] │  │
│  │ ម៉ោងពិធី    │ ម៉ោងពិសា      │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  📍 ទីកន្លែងពិធី                    │
│  ┌───────────────────────────────┐  │
│  │ ឈ្មោះទីកន្លែង [VenuePicker]   │  │
│  │ អាសយដ្ឋាន [textarea]         │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  👗 ពណ៌ Dress Code                  │
│  ┌───────────────────────────────┐  │
│  │ [DressCodePicker - swatches]  │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  🎵 តន្ត្រី Background               │
│  ┌───────────────────────────────┐  │
│  │ [MusicPicker - track list]    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Card bg | `#ffffff` | Card background |
| Card border | `#ece6da` | Default border |
| Card border hover | `#d8cdb8` | Hover state |
| Card radius | `16px` | Border radius |
| Card shadow hover | `0 8px 24px rgba(176,146,106,0.08)` | Hover shadow |
| Icon bg | `#faf3e6` | Icon container |
| Label color | `#4a3a26` | Field labels |
| Hint color | `#9a8a6e` | Helper text |
| Error color | `#c0392b` | Validation errors |
| Focus ring | `#b0926a` | Input focus |
| Input bg | `#fdfbf7` | Textarea background |

## Props

| Prop | Type | Description |
|------|------|-------------|
| `draft` | object | Draft state ពី useWeddingStore |
| `updateField` | function | `updateField(section, partialObj)` — update nested field |
| `update` | function | `update(partialDraft)` — update top-level draft fields |

## Cards & Fields

### Card 1: កាលបរិច្ឆេទ និងពេលវេលា
| Field | Component | Path | Placeholder |
|-------|-----------|------|-------------|
| កាលបរិច្ឆេទពិធី | DatePicker | `draft.event.date` | ជ្រើសកាលបរិច្ឆេទ |
| ម៉ោងពិធី | TimePicker | `draft.event.ceremonyTime` | ជ្រើសម៉ោងពិធី |
| ម៉ោងពិសាភោជនាហារ | TimePicker | `draft.event.receptionTime` | ជ្រើសម៉ោងពិសាភោជនាហារ |

### Card 2: ទីកន្លែងពិធី
| Field | Component | Path | Notes |
|-------|-----------|------|-------|
| ឈ្មោះទីកន្លែង | VenuePicker | `draft.event.venueName` | onSelect auto-fills address |
| អាសយដ្ឋាន | textarea | `draft.event.venueAddress` | Editable after auto-fill |

### Card 3: ពណ៌ Dress Code
| Field | Component | Path | Default |
|-------|-----------|------|---------|
| Dress Code | DressCodePicker | `draft.dressCode` | DRESS_CODE_COMBOS[0] |

### Card 4: តន្ត្រី Background
| Field | Component | Path | Default |
|-------|-----------|------|---------|
| Music | MusicPicker | `draft.music` | MUSIC_TRACKS[0] |

## Validation Rules

| Field | Rule |
|-------|------|
| Date | Required — must be a future date |
| Ceremony Time | Required |
| Reception Time | Required — should be after ceremony time |
| Venue Name | Required — min 2 characters |
| Venue Address | Optional but recommended |
| Dress Code | Always has default — no validation needed |
| Music | Always has default — no validation needed |

## Dependencies

```
shared/ui/TimePicker
shared/ui/DatePicker
shared/ui/VenuePicker
shared/ui/DressCodePicker
shared/ui/MusicPicker
shared/data/dressCodeColors → DRESS_CODE_COMBOS
shared/data/musicTracks → MUSIC_TRACKS
```

## Live Preview Behavior

- Date/Time changes → update countdown timer in phone preview
- Venue changes → update venue section in invitation
- Dress Code → update dress code color display in invitation
- Music → stored for playback when invitation opens (no autoplay in builder)
