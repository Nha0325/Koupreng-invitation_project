import { LoadingButton } from "@/shared/ui";

export function QrDownloadButton({ onDownload, downloading }) {
  return (
    <LoadingButton
      type="button"
      className="dash-btn dash-btn-primary"
      isLoading={downloading}
      onClick={onDownload}
    >
      ទាញយក QR Code (PNG)
    </LoadingButton>
  );
}

export default QrDownloadButton;
