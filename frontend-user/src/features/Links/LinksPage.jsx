import { useState } from "react";
import "./LinksPage.css";
import AddLinkModal from "../../shared/components/modals/AddLinkModal";

const allLinks = [
  {
    id: 1,
    name: "វេបសាយកាតក្រុមគ្រួសារ",
    url: "https://family-card.koupreang.com",
    category: "កាតអញ្ជើញ",
    clicks: 156,
    status: "active",
  },
  {
    id: 2,
    name: "វេបសាយកាតមិត្តភក្ដិ",
    url: "https://friends-card.koupreang.com",
    category: "កាតអញ្ជើញ",
    clicks: 234,
    status: "active",
  },
  {
    id: 3,
    name: "វេបសាយកាតការងារ",
    url: "https://work-card.koupreang.com",
    category: "កាតអញ្ជើញ",
    clicks: 89,
    status: "active",
  },
  {
    id: 4,
    name: "ទំព័រសម្រាប់បង់ប្រាក់",
    url: "https://payment.koupreang.com",
    category: "ការបង់ប្រាក់",
    clicks: 78,
    status: "active",
  },
  {
    id: 5,
    name: "ទំព័រសម្រាប់អភិវឌ្ឍន៍",
    url: "https://rsvp.koupreang.com",
    category: "RSVP",
    clicks: 312,
    status: "active",
  },
  {
    id: 6,
    name: "វីដេអូព្រឹត្តិការណ៍",
    url: "https://video.koupreang.com",
    category: "មេឌៀ",
    clicks: 145,
    status: "active",
  },
  {
    id: 7,
    name: "រូបថតព្រឹត្តិការណ៍",
    url: "https://photos.koupreang.com",
    category: "មេឌៀ",
    clicks: 267,
    status: "active",
  },
  {
    id: 8,
    name: "ផែនទីទីតាំង",
    url: "https://map.koupreang.com",
    category: "ព័ត៌មាន",
    clicks: 198,
    status: "active",
  },
  {
    id: 9,
    name: "កាលបរិច្ឆេទព្រឹត្តិការណ៍",
    url: "https://schedule.koupreang.com",
    category: "ព័ត៌មាន",
    clicks: 423,
    status: "active",
  },
  {
    id: 10,
    name: "បញ្ជីអនុសាសន៍",
    url: "https://registry.koupreang.com",
    category: "អនុសាសន៍",
    clicks: 56,
    status: "active",
  },
  {
    id: 11,
    name: "ការណែនាំសម្លៀកបំពាក់",
    url: "https://attire.koupreang.com",
    category: "ព័ត៌មាន",
    clicks: 134,
    status: "active",
  },
  {
    id: 12,
    name: "ទំនាក់ទំនងអភិបាល",
    url: "https://contact.koupreang.com",
    category: "ព័ត៌មាន",
    clicks: 89,
    status: "active",
  },
];

const categoryOptions = [
  "ទាំងអស់",
  "កាតអញ្ជើញ",
  "ការបង់ប្រាក់",
  "RSVP",
  "មេឌៀ",
  "ព័ត៌មាន",
  "អនុសាសន៍",
];

const statusColor = {
  active: "status-active",
  inactive: "status-inactive",
};

const LinksPage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategory] = useState("ទាំងអស់");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [links, setLinks] = useState(allLinks);

  const filtered = links.filter((link) => {
    const matchSearch = link.name.includes(search) || link.url.includes(search);
    const matchCategory =
      categoryFilter === "ទាំងអស់" || link.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const activeLinks = links.filter((link) => link.status === "active").length;

  const handleAddLink = (newLink) => {
    const linkWithId = {
      ...newLink,
      id: links.length + 1,
      clicks: 0,
    };
    setLinks([...links, linkWithId]);
  };

  return (
    <div className="lp-page">
      {/* Header */}
      <div className="lp-header">
        <div>
          <h1 className="lp-title">ចំណងដៃ</h1>
          <p className="lp-subtitle">
            គ្រប់គ្រងតំណភ្ជាប់ទាំងអស់របស់ព្រឹត្តិការណ៍
          </p>
        </div>
        <button className="lp-add-btn" onClick={() => setIsAddModalOpen(true)}>
          + បន្ថែមតំណភ្ជាប់
        </button>
      </div>

      {/* Stats */}
      <div className="lp-stats">
        {[
          { label: "តំណភ្ជាប់សរុប", value: links.length, cls: "stat-total" },
          { label: "សកម្មភាព", value: activeLinks, cls: "stat-active" },
          { label: "ចុចសរុប", value: totalClicks, cls: "stat-clicks" },
          {
            label: "មធ្យមចុច",
            value: Math.round(totalClicks / links.length),
            cls: "stat-avg",
          },
        ].map((s) => (
          <div key={s.label} className={`lp-stat-card ${s.cls}`}>
            <span className="lp-stat-value">{s.value}</span>
            <span className="lp-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="lp-filters">
        <input
          type="text"
          className="lp-search"
          placeholder="🔍 ស្វែងរកតំណភ្ជាប់..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="lp-filter-group">
          {categoryOptions.map((c) => (
            <button
              key={c}
              className={`lp-filter-btn${categoryFilter === c ? " active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="lp-table-wrap">
        <table className="lp-table">
          <thead>
            <tr>
              <th>ឈ្មោះ</th>
              <th>URL</th>
              <th>ប្រភេទ</th>
              <th>ចុច</th>
              <th>ស្ថានភាព</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((link) => (
              <tr key={link.id}>
                <td className="lp-name">{link.name}</td>
                <td className="lp-url">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-url-link"
                  >
                    {link.url}
                  </a>
                </td>
                <td>
                  <span className="lp-cat-badge">{link.category}</span>
                </td>
                <td className="lp-clicks">{link.clicks}</td>
                <td>
                  <span className={`lp-status ${statusColor[link.status]}`}>
                    {link.status === "active" ? "សកម្ម" : "មិនសកម្ម"}
                  </span>
                </td>
                <td>
                  <button className="lp-action-btn">⋯</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="lp-empty">មិនមានតំណភ្ជាប់ត្រូវនឹងការស្វែងរក</div>
        )}
      </div>

      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLink}
      />
    </div>
  );
};

export default LinksPage;
