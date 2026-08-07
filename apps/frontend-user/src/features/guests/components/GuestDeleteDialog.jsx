import { ConfirmDialog } from "@/shared/ui";

export default function GuestDeleteDialog({
  guest,
  onClose,
  onConfirm,
  saving,
  t,
}) {
  return (
    <ConfirmDialog
      isOpen={Boolean(guest)}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t ? t("deleteConfirmTitle") : "លុបឈ្មោះភ្ញៀវ"}
      message={
        t
          ? t("deleteConfirmMsg", { name: guest?.name || "ភ្ញៀវ" })
          : `តើអ្នកពិតជាចង់លុបឈ្មោះ "${guest?.name || "ភ្ញៀវ"}" ចេញពីបញ្ជីឬ?`
      }
      confirmLabel={t ? t("delete") : "លុប"}
      cancelLabel={t ? t("cancel") : "បោះបង់"}
      isDestructive={true}
      isLoading={saving}
    />
  );
}
