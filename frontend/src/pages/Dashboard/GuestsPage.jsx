import Aside from "../../components/Aside";
import GuestsFeature from "../../features/Guests/GuestsPage";
import "../../features/Dashboard/Dashboard.css";

function GuestsPage() {
  return (
    <div className="dash-wrapper">
      <div className="dash-sidebar">
        <Aside />
      </div>
      <div className="dash-main-scroll">
        <GuestsFeature />
      </div>
    </div>
  );
}

export default GuestsPage;
