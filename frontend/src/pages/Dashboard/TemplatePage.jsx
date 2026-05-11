import Aside from "../../components/Aside";
import TemplateFeature from "../../features/Template/TemplatePage";
import "../../features/Dashboard/Dashboard.css";

function TemplatePage() {
  return (
    <div className="dash-wrapper">
      <div className="dash-sidebar">
        <Aside />
      </div>
      <div className="dash-main-scroll">
        <TemplateFeature />
      </div>
    </div>
  );
}

export default TemplatePage;
