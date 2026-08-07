# Asset Reference Report

## Result

The baseline contained 159 tracked media assets totaling 138,339,676 bytes. The cleaned application contains 108 tracked media assets totaling 55,504,825 bytes: 71 JPG, 13 SVG, 9 PNG, 9 WebP, 4 MP4, 1 MP3, and 1 M4A. The net reduction is 51 assets and 82,834,851 bytes (about 79.0 MiB).

## Evidence used

- Static imports and CSS `url(...)` references.
- Literal public URLs and runtime-generated `/facebook/all/<folder>/<number>.jpg` paths.
- Template catalog data, `RoyalInvitation`, Canva renderer section names, favicon references, and builder fallbacks.
- SHA-256 comparison for important/duplicate candidates.
- User frontend Knip, depcheck, production build, route tests, and desktop/mobile Playwright journeys.
- Git history confirming the old Garden Royal Sambot renderer had been superseded by the active Canva renderer.

## Retained asset groups

| Group | Why retained |
| --- | --- |
| `public/facebook/all/01-card` through `11-card` | `RoyalInvitation` constructs these paths dynamically; literal-only analysis would incorrectly mark some as unused |
| `public/invitations/canva-khmer/**` | Active `CanvaKhmerWeddingTemplate` composes section artwork by runtime path |
| `public/invitations/khmer-golden-canva-inspired/**` | Active template catalog/renderer paths |
| `public/templates/cover-khmer-golden-wedding/**` | Active Cover Khmer template artwork |
| `public/vdo/1.mp4` through `4.mp4` | Active opening-video choices |
| `src/assets/icons/background.png` | Imported by marketing/template pages and builder CSS |
| `src/assets/logo.png` and `public/logo.png` | In-app navigation/animation logo and document favicon respectively; different content and roles |
| Two bundled music tracks | Imported by catalog, wedding renderer, and shared music picker; custom-upload/none behavior remains intact |

## Key retained hashes

| Path | Bytes | SHA-256 |
| --- | ---: | --- |
| `src/assets/music/Instrumental Wedding Music (VioSounds Cover).m4a` | 3,918,818 | `473b24794213ea38fb2b97e1f8a5e71f8a7eeef1badac35e9268d1fd53599749` |
| `src/assets/music/ថ្ងៃដែលរង់ចាំ.mp3` | 2,704,609 | `35c435374ea9a98a1af1b7f7840d4e2054a959709e96c4a0277d6b16ccb2f27c` |
| `src/assets/icons/background.png` | 2,520,889 | `1f221a840fd6d8fb14413b1f308f8ea6ca7b337f34d72f76ed3ddfa70311cbd3` |
| `src/assets/logo.png` | 384,504 | `be59c7e274aab8b060a11ae01f637e96a0d9876ff4062062fe43d6c39a5d6265` |
| `public/logo.png` | 467,587 | `2de4947568abf57bb9e4f3416673661c31fc9db379c3023b3e25c9dd1966aee4` |
| `public/invitations/canva-khmer/CoverKhmer.svg` | 3,895,101 | `f9179d4cdaccfeb383c952de3ac957c3fce4e4ee6324292be115ba36791d91e7` |

## Deleted classes

- Three duplicate unused `hero-phone.webm` files and unused example opening videos.
- Three unreferenced bundled songs; removal does not alter custom music uploads, the two active defaults, or the no-music option.
- Unreferenced starter icons/Vite/React SVGs, `a2`-`a7` images, duplicated source logo/background, unused flower/background libraries, and superseded Canva/cover artwork.
- Asset notes and license text were moved to documentation rather than shipped inside application source/public output.

The path-level reason and validation for every deletion is in `deletion-manifest.md`.

## Licensing and optimization blockers

Repository evidence does not establish redistribution rights for the retained music or Facebook photo galleries. Those assets must not be promoted to production until ownership/license records are supplied. The 3.9 MiB Canva SVG, 2.5 MiB background, four MP4 files, gallery JPG set, and two bundled tracks also remain performance candidates; optimization requires visual/audio acceptance criteria and is not safe as a blind cleanup.
