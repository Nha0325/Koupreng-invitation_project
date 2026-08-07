# របៀបបន្ថែម Template

Catalog ផ្លូវការស្ថិតនៅ `apps/frontend-user/src/features/templates/data/templatesData.js`។ បច្ចុប្បន្នមាន Garden Royal Khmer, Cover Khmer Golden និង Khmer Golden Canva-inspired variants។

1. កំណត់ ID ថេរ និង metadata ក្នុង `templatesData.js`។
2. ដាក់ public artwork ក្រោម `apps/frontend-user/public/invitations/` ឬ `public/templates/` ដោយឈ្មោះមានន័យ។
3. ប្រើ `TemplateExperience` engine និងបន្ថែម theme នៅ `templateExperienceThemes.js`; renderer ថ្មីដាច់ដោយឡែកគួរបង្កើតតែពេល structure ពិតជាខុស។
4. រក្សា `mainImage`, `phoneCoverImage`, slideshow/story media, music, Khmer copy, date/time, venue និង enabled sections ឲ្យស្របគ្នា។
5. កុំភ្ជាប់ទៅ machine-local path; public path ចាប់ផ្តើមដោយ `/`។
6. កត់ត្រាប្រភព និងអាជ្ញាបណ្ណ asset ហើយបន្ថែម route/unit/browser tests។
7. រត់ `npm run lint`, `npm test`, `npm run build`, `npm run analyze:knip` និង `npm run test:e2e`។

កុំបង្កើត preview engine ទីពីរ ឬ duplicate router ដើម្បីបន្ថែម template មួយ។
