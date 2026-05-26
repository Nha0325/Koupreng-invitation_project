import { Link } from "react-router-dom";
import { listDrafts } from "../../../../services/weddingStorage";

export default function DraftsSection() {
  const drafts = listDrafts();

  return (
    <section className="dash-card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800 m-0">
            សន្លឹកការរបស់អ្នក
          </h2>

          <p className="text-xs text-[#7a8799] m-0">
            គ្រប់គ្រង Draft និង Preview
          </p>
        </div>

        <Link
          to="/create/wedding"
          className="px-4 py-2 rounded-xl text-white text-xs font-medium"
          style={{
            background: "linear-gradient(166deg,#8686d9 0%,#6b6bc4 100%)",
          }}
        >
          + បង្កើតថ្មី
        </Link>
      </div>

      {drafts.length === 0 ? (
        <div className="rounded-xl bg-[#f8f8fd] p-4 text-sm text-[#7a8799]">
          មិនទាន់មាន draft។
        </div>
      ) : (
        <div className="grid gap-3">
          {drafts.map((draft) => (
            <article
              key={draft.id}
              className="rounded-xl border border-[#f3e8f0] bg-white p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 m-0">
                    {draft.couple?.groom || "Groom"} &{" "}
                    {draft.couple?.bride || "Bride"}
                  </h3>

                  <p className="text-xs text-[#7a8799] mt-1 mb-0">
                    Template: {draft.templateId || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <Link
                    to={`/create/wedding/${draft.id}`}
                    className="text-[#6b6bc4] font-medium"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/preview/${draft.id}`}
                    className="text-[#6b6bc4] font-medium"
                  >
                    Preview
                  </Link>

                  {draft.slug && (
                    <Link
                      to={`/w/${draft.slug}`}
                      className="text-[#6b6bc4] font-medium"
                    >
                      Public
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
