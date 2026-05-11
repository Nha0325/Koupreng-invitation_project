import Aside from "../../components/Aside";
import WeddingGiftFeature from "../../features/WeddingGift/WeddingGiftPage";
import "../../features/Dashboard/Dashboard.css";

function WeddingGiftPage() {
  return (
    <div className="dash-wrapper">
      <div className="dash-sidebar">
        <Aside />
      </div>
      <div className="dash-main-scroll">
        <WeddingGiftFeature />
      </div>
    </div>
  );
}

export default WeddingGiftPage;
