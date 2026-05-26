# 🌳 Project Tree

```
frontend-user/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── image/
│       ├── a1.png - a7.png
│
├── src/
│   ├── main.jsx                          ← entry point
│   ├── index.css                         ← global styles
│   │
│   ├── app/                              ← app setup
│   │   ├── App.jsx
│   │   ├── router.jsx                    ← main router
│   │   ├── ScrollToTop.jsx
│   │   └── routes/
│   │       ├── adminRoutes.jsx
│   │       ├── authRoutes.jsx
│   │       ├── builderRoutes.jsx
│   │       ├── hostRoutes.jsx
│   │       ├── marketingRoutes.jsx
│   │       └── routes.md
│   │
│   ├── assets/                           ← static assets (imported)
│   │   ├── fonts/
│   │   │   └── fonts.css
│   │   ├── icons/
│   │   │   ├── background.png
│   │   │   ├── icon-1.png
│   │   │   ├── icon-2-2.png
│   │   │   ├── icon-2-3.png
│   │   │   ├── icon-3.png
│   │   │   └── icon-4.png
│   │   ├── images/
│   │   │   ├── background.png
│   │   │   └── logo.png
│   │   ├── music/
│   │   │   ├── 2MDIE - SNEHA ft. TEY (DJ Chee remix).mp3
│   │   │   ├── A Thousand Years - Christina Perri.mp3
│   │   │   ├── Instrumental Wedding Music.m4a
│   │   │   ├── Tena - ថែ Thae.mp3
│   │   │   └── YENGKY - DRUNK 2.mp3
│   │   ├── vdo-open-then-show-wedding/
│   │   │   ├── curtain-video-BAKLj3Y5.mp4
│   │   │   ├── hero-phone.webm
│   │   │   ├── intro-video-BpkZMtTn.mov
│   │   │   ├── mediterranean-preview.mp4
│   │   │   └── theme-finca.mov
│   │   ├── hero.png
│   │   ├── logo.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── features/                         ← feature modules
│   │   ├── events/
│   │   │   ├── CreateEventForm.jsx
│   │   │   ├── CreateEventPage.css
│   │   │   ├── EventsPage.css
│   │   │   └── EventsPage.jsx
│   │   │
│   │   ├── expenses/
│   │   │   ├── ExpensesList.jsx
│   │   │   └── ExpensesPage.css
│   │   │
│   │   ├── guests/
│   │   │   ├── GuestsList.jsx
│   │   │   └── GuestsPage.css
│   │   │
│   │   ├── rsvp/
│   │   │   ├── components/
│   │   │   │   ├── RsvpForm.jsx
│   │   │   │   └── RsvpSuccess.jsx
│   │   │   └── rsvp.css
│   │   │
│   │   ├── templates/
│   │   │   ├── components/
│   │   │   │   ├── TemplateGrid.jsx
│   │   │   │   └── read.ass
│   │   │   ├── data/
│   │   │   │   └── templatesData.js      ← template configs + imports
│   │   │   ├── previews/
│   │   │   │   ├── ClassicPreview.jsx
│   │   │   │   ├── LuxuryPreview.jsx
│   │   │   │   ├── ModernKhmerPreview.jsx
│   │   │   │   ├── RoyalKhmerPreview.jsx
│   │   │   │   ├── RoyalPreview.jsx
│   │   │   │   └── VintageGoldPreview.jsx
│   │   │   ├── templates.css
│   │   │   └── view_card_tamplate.md
│   │   │
│   │   ├── wedding-builder/
│   │   │   ├── components/
│   │   │   │   ├── BuilderSidebar.jsx
│   │   │   │   ├── PhonePreview.jsx
│   │   │   │   ├── PublishBox.jsx
│   │   │   │   ├── StepNavigation.jsx
│   │   │   │   └── view_phone_in_create_theab_ka.md
│   │   │   ├── config/
│   │   │   │   └── builderSteps.js
│   │   │   ├── steps/
│   │   │   │   ├── CoupleInfoStep.jsx
│   │   │   │   ├── EventInfoStep.jsx
│   │   │   │   ├── ReviewPublishStep.jsx
│   │   │   │   ├── RsvpSettingsStep.jsx
│   │   │   │   ├── SelectTemplateStep.jsx
│   │   │   │   ├── StoryGalleryStep.jsx
│   │   │   │   └── information_create_theab_ka.md
│   │   │   ├── utils/
│   │   │   │   └── buildInvitationData.js
│   │   │   ├── CreateWedding.jsx
│   │   │   └── builder.css
│   │   │
│   │   ├── wedding-gift/
│   │   │   ├── WeddingGiftList.jsx
│   │   │   └── WeddingGiftPage.css
│   │   │
│   │   └── wedding-site/
│   │       ├── hooks/
│   │       │   └── useCountdown.js
│   │       ├── RoyalInvitation.jsx        ← កាតអាពាហ៍ពិពាហ៍ (main card)
│   │       ├── WeddingSite.jsx
│   │       ├── wedding-site.css
│   │       └── view_in_phone.md
│   │
│   ├── layouts/                          ← shell layouts
│   │   ├── components/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── Aside.jsx
│   │   │   ├── Aside.css
│   │   │   ├── Footer.jsx
│   │   │   └── Header.jsx
│   │   ├── AdminShell.jsx
│   │   ├── AuthShell.jsx
│   │   ├── HostShell.jsx
│   │   └── MarketingShell.jsx
│   │
│   ├── pages/                            ← page components
│   │   ├── admin/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TemplatesPage.jsx
│   │   │   └── UsersPage.jsx
│   │   ├── auth/
│   │   │   ├── context/
│   │   │   │   ├── AuthContext.jsx
│   │   │   │   └── useAuth.js
│   │   │   ├── AuthPage.css
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── SocialAuthButtons.jsx
│   │   ├── host/
│   │   │   ├── dashboard/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Dashboard.css
│   │   │   ├── CreateEventPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   ├── ExpensesPage.jsx
│   │   │   ├── GuestsPage.jsx
│   │   │   └── WeddingGiftPage.jsx
│   │   ├── marketing/
│   │   │   ├── HomePage.jsx
│   │   │   ├── HomePage.css
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── PricingPage.jsx
│   │   │   ├── TemplateDemoPage.jsx
│   │   │   ├── TemplatesPage.jsx
│   │   │   └── VenuesPage.jsx
│   │   ├── CreateWeddingPage.jsx
│   │   ├── PublicInvitationPage.jsx
│   │   └── WeddingPreviewPage.jsx
│   │
│   ├── services/                         ← API & storage
│   │   ├── remote/
│   │   │   ├── api/
│   │   │   │   ├── client.js
│   │   │   │   └── errors.js
│   │   │   ├── authService.js
│   │   │   ├── authStorage.js
│   │   │   ├── eventService.js
│   │   │   └── guestService.js
│   │   ├── galleryStorage.js
│   │   ├── invitationService.js
│   │   ├── rsvpService.js
│   │   └── weddingStorage.js
│   │
│   ├── shared/                           ← shared utilities & UI
│   │   ├── data/
│   │   │   ├── dressCodeColors.js
│   │   │   └── musicTracks.js
│   │   ├── motion/
│   │   │   └── variants.js
│   │   ├── ui/
│   │   │   ├── AnimatedButton.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── DatePicker.jsx / .css
│   │   │   ├── DressCodePicker.jsx / .css
│   │   │   ├── GlassCard.jsx
│   │   │   ├── MagicCard.jsx
│   │   │   ├── MusicPicker.jsx / .css
│   │   │   ├── PageTransition.jsx
│   │   │   ├── ScrollReveal.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── TimePicker.jsx / .css
│   │   │   ├── TimePickerDropdown.jsx
│   │   │   ├── Toaster.jsx
│   │   │   └── VenuePicker.jsx / .css
│   │   └── utils/
│   │       ├── constants/
│   │       │   └── routes.js
│   │       ├── hooks/
│   │       │   ├── useHeroAnimation.js
│   │       │   ├── useImageSlider.js
│   │       │   ├── useLenis.js
│   │       │   ├── usePrefersReducedMotion.js
│   │       │   └── useToggle.js
│   │       └── slugify.js
│   │
│   └── stores/                           ← state management
│       ├── useAuthStore.js
│       ├── useUiStore.js
│       └── useWeddingStore.js
│
├── index.html
├── package.json
├── eslint.config.js
├── .env
└── .gitignore
```
