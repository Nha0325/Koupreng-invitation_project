import Aside from "../../components/Aside";
import DashboardMain from "../../features/Dashboard/Dashboard";
import "../../features/Dashboard/Dashboard.css";

function DashboardPage() {
  return (
    <div className="dash-wrapper">
      <div className="dash-sidebar">
        <Aside />
      </div>
      <div className="dash-main-scroll">
        <DashboardMain />
      </div>
    </div>
  );
}

export default DashboardPage;
