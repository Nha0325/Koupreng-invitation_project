# Wedding Builder

`WeddingBuilderFeature.jsx` ជា implementation ផ្លូវការសម្រាប់បង្កើត និងកែ wedding draft។ Route page គឺ `pages/builder/CreateWeddingPage.jsx`; implementation ចាស់ `CreateWedding.jsx` ត្រូវបានដកចេញព្រោះមិនមាន importer។

Builder មានជំហានសម្រាប់ជ្រើស template, បញ្ចូលព័ត៌មានគូស្វាមីភរិយា និងកម្មវិធី, gallery/story, venue/RSVP, media/design enhancements និង review/publish។ `PhonePreview.jsx` បម្លែង draft ទៅ template content ដោយ adapter ដូចគ្នានឹង public preview ដើម្បីកាត់បន្ថយភាពខុសគ្នារវាង preview និង invitation ពិត។

Assets សំខាន់ៗ៖

- Opening videos ប្រើ public URLs `/vdo/1.mp4` ដល់ `/vdo/4.mp4` តាម `shared/data/openingVideos.js`។
- Music choices ប្រើ track ដែល import នៅ `shared/data/musicTracks.js`។
- Gallery ធំរក្សាទុកក្នុង IndexedDB តាម `shared/storage/galleryStorage.js`; draft metadata ប្រើ wedding storage/store។
- Venue, music និង opening-video pickers ផ្លូវការស្ថិតនៅ `shared/ui/` ហើយ builder import ពួកវា។

ពេលបន្ថែមជំហានថ្មី ត្រូវកែ state/defaults, adapter ទៅ backend និង preview, validation, review summary និង tests ជាមួយគ្នា។
