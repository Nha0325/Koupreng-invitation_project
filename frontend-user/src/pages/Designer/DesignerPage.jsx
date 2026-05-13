import { useParams, useSearchParams } from "react-router-dom";
import DesignerFeature from "../../features/InvitationDesigner/DesignerPage";

const DesignerPage = () => {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  return <DesignerFeature key={templateId || editId || "new"} />;
};

export default DesignerPage;
