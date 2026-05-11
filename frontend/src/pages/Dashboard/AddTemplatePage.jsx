import Aside from "../../components/Aside";
import AddTemplateFeature from "../../features/AddTemplate/AddTemplatePage";
import "../../features/Dashboard/Dashboard.css";

function AddTemplatePage() {
  return (
    <div className="dash-wrapper">
      <div className="dash-sidebar">
        <Aside />
      </div>
      <div className="dash-main-scroll">
        <AddTemplateFeature />
      </div>
    </div>
  );
}

export default AddTemplatePage;
