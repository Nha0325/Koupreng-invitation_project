import { useRef } from "react";
import { DressCodePicker } from "../../../shared/ui/DressCodePicker";
import { MusicPicker } from "../../../shared/ui/MusicPicker";
import { DRESS_CODE_COMBOS } from "../../../shared/data/dressCodeColors";
import { MUSIC_TRACKS } from "../../../shared/data/musicTracks";
import RepeatableList from "../components/RepeatableList";

export default function EnhancementsStep({ draft, update }) {
    const fileInputRef = useRef(null);
    const gallery = draft?.gallery || [];
    const dressCode = draft?.dressCode || DRESS_CODE_COMBOS[0];
    const music = draft?.music || MUSIC_TRACKS[0];

    const storyChapters = draft?.storyChapters || [];
    const party = draft?.party || [];
    const gift = draft?.gift || [];
    const faq = draft?.faq || [];

    const handleFiles = (event) => {
        const files = Array.from(event.target.files || []);
        const urls = files.map((file) => URL.createObjectURL(file));
        update({ gallery: [...gallery, ...urls] });
    };

    const removeImage = (index) => {
        update({ gallery: gallery.filter((_, itemIndex) => itemIndex !== index) });
    };

    return (
        <div>
            <h2>Notes &amp; media</h2>
            <p className="wb-help">ព័ត៌មានខាងក្រោមជាជម្រើសបន្ថែម។ បំពេញ ឬចុច «បន្ថែម» ដើម្បីបង្ហាញផ្នែកនីមួយៗ។ បើទុកទទេ វានឹងប្រើគំរូជំនួស។</p>

            {/* Short story blurb + gallery */}
            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Story</span>
                    <h3>រឿងរ៉ាវ និងរូបភាព</h3>
                </div>

                <div className="wb-field">
                    <label>រឿងរ៉ាវរបស់យើង (សង្ខេប)</label>
                    <textarea
                        rows={4}
                        value={draft?.story || ""}
                        onChange={(e) => update({ story: e.target.value })}
                        placeholder="សរសេរខ្លីៗពីរឿងរ៉ាវរបស់អ្នក..."
                    />
                </div>

                <div className="wb-field">
                    <label>រូបភាព</label>
                    <div
                        className="wb-dropzone"
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                fileInputRef.current?.click();
                            }
                        }}
                    >
                        <div className="wb-dropzone-content">
                            <div className="wb-dropzone-icon">📷</div>
                            <p>ចុចដើម្បីបញ្ចូលរូបភាព</p>
                            <small>JPG, PNG — អតិបរមា 5MB ក្នុងមួយរូប</small>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleFiles}
                    />
                </div>

                {gallery.length > 0 && (
                    <div className="wb-gallery-grid">
                        {gallery.map((url, index) => (
                            <div key={`${url}-${index}`} className="wb-gallery-item">
                                <img src={url} alt={`Gallery ${index + 1}`} className="wb-gallery-thumb" />
                                <button
                                    type="button"
                                    className="wb-gallery-remove"
                                    onClick={() => removeImage(index)}
                                    aria-label="Remove image"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Love story chapters (timeline) */}
            <RepeatableList
                kicker="Love story"
                title="ជំពូករឿងរ៉ាវស្នេហា (ស្រេចចិត្ត)"
                help="បន្ថែមជំពូកនីមួយៗ ឧ. ថ្ងៃជួបគ្នា ការណាត់ជួប ថ្ងៃសុំដៃ។ រូបភាពនឹងភ្ជាប់ដោយស្វ័យប្រវត្តិពីគំរូ។"
                items={storyChapters}
                onChange={(next) => update({ storyChapters: next })}
                addLabel="+ បន្ថែមជំពូក"
                itemLabel="ជំពូក"
                makeEmpty={() => ({ kicker: "", title: "", date: "", text: "" })}
                fields={[
                    { key: "kicker", label: "ស្លាកជំពូក (ស្រេចចិត្ត)", placeholder: "ឧ. ជំពូកទី ១" },
                    { key: "title", label: "ចំណងជើង", placeholder: "ឧ. ថ្ងៃដែលយើងជួបគ្នា" },
                    { key: "date", label: "ពេលវេលា (ស្រេចចិត្ត)", placeholder: "ឧ. មករា ២០២១" },
                    { key: "text", label: "ការពិពណ៌នា", type: "textarea", rows: 3, wide: true, placeholder: "ឧ. ក្នុងពិធីបុណ្យមួយ ភ្នែកទាំងពីរបានជួបគ្នាដំបូង..." },
                ]}
            />

            {/* Wedding party / crew */}
            <RepeatableList
                kicker="Wedding party"
                title="ក្រុមអម / ក្រុមការងារ (ស្រេចចិត្ត)"
                help="បន្ថែមសមាជិកក្រុមអម ឧ. កូនកំលោះកិត្តិយស កូនក្រមុំកិត្តិយស គ្រួសារ មិត្តភក្ដិ។"
                items={party}
                onChange={(next) => update({ party: next })}
                addLabel="+ បន្ថែមសមាជិក"
                itemLabel="សមាជិក"
                makeEmpty={() => ({ role: "", roleEn: "", name: "" })}
                fields={[
                    { key: "role", label: "តួនាទី", placeholder: "ឧ. កូនកំលោះកិត្តិយស" },
                    { key: "roleEn", label: "តួនាទី (EN)", placeholder: "ឧ. Best Man" },
                    { key: "name", label: "ឈ្មោះ", wide: true, placeholder: "ឧ. សុខ វិបុល" },
                ]}
            />

            {/* Gift / bank accounts */}
            <RepeatableList
                kicker="Gift"
                title="គណនីចងដៃមង្គល (ស្រេចចិត្ត)"
                help="បន្ថែមគណនីធនាគារ ឧ. ABA, ACLEDA, Wing ដើម្បីឱ្យភ្ញៀវអាចចូលរួមចងដៃ។"
                items={gift}
                onChange={(next) => update({ gift: next })}
                addLabel="+ បន្ថែមគណនី"
                itemLabel="គណនី"
                makeEmpty={() => ({ bank: "", account: "", number: "", note: "" })}
                fields={[
                    { key: "bank", label: "ធនាគារ", placeholder: "ឧ. ABA Bank" },
                    { key: "note", label: "ស្លាក (ស្រេចចិត្ត)", placeholder: "ឧ. ABA PAY" },
                    { key: "account", label: "ឈ្មោះម្ចាស់គណនី", wide: true, placeholder: "ឈ្មោះម្ចាស់គណនី" },
                    { key: "number", label: "លេខគណនី", wide: true, placeholder: "000 000 000" },
                ]}
            />

            {/* FAQ */}
            <RepeatableList
                kicker="FAQ"
                title="សំណួរញឹកញាប់ (ស្រេចចិត្ត)"
                help="បន្ថែមសំណួរ និងចម្លើយ ដើម្បីជួយភ្ញៀវ ឧ. ទីតាំង សម្លៀកបំពាក់ កន្លែងចតរថយន្ត។"
                items={faq}
                onChange={(next) => update({ faq: next })}
                addLabel="+ បន្ថែមសំណួរ"
                itemLabel="សំណួរ"
                makeEmpty={() => ({ q: "", a: "" })}
                fields={[
                    { key: "q", label: "សំណួរ", wide: true, placeholder: "ឧ. តើពិធីប្រព្រឹត្តទៅនៅទីណា?" },
                    { key: "a", label: "ចម្លើយ", type: "textarea", rows: 3, wide: true, placeholder: "ឧ. ពិធីនឹងប្រព្រឹត្តទៅនៅទីតាំងដែលបានបញ្ជាក់..." },
                ]}
            />

            <details className="wb-advanced">
                <summary>Dress code និងតន្ត្រី</summary>
                <div className="wb-advanced-body">
                    <div className="wb-field">
                        <label>ពណ៌ Dress Code</label>
                        <DressCodePicker
                            value={dressCode}
                            onChange={(combo) => update({ dressCode: combo })}
                        />
                    </div>

                    <div className="wb-field">
                        <label>តន្ត្រី Background</label>
                        <MusicPicker
                            value={music}
                            onChange={(track) => update({ music: track })}
                        />
                    </div>
                </div>
            </details>
        </div>
    );
}
