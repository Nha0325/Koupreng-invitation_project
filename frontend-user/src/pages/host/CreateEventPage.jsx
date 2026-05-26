import { useNavigate, useSearchParams } from "react-router-dom";

import CreateEventForm from "../../features/events/CreateEventForm";

const CreateEventPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <CreateEventForm 
      onBack={() => navigate("/dashboard/events")}
      onCreated={() => navigate("/dashboard")}
      initialTemplateId={searchParams.get("template")}
    />
  );
};

export default CreateEventPage
