import { useParams } from "react-router-dom";
import DesignerFeature from "../../features/InvitationDesigner/DesignerPage";

const DesignerPage = () => {
  const { templateId } = useParams();
  return <DesignerFeature key={templateId} />;
};

export default DesignerPage;
