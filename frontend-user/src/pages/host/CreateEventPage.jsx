import { useNavigate, useSearchParams } from "react-router-dom";

import CreateEventForm from "../../features/events/CreateEventForm";
import { createDraft } from "../../services/weddingStorage";
import { setActiveEventId } from "../../services/hostPlanningStorage";

const CreateEventPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTemplateId = searchParams.get("template");

  const handleCreated = (createdEvent) => {
    const draft = createDraft({
      templateId: createdEvent.templateId || initialTemplateId || "royal",
      couple: {
        groom: createdEvent.groom || "",
        bride: createdEvent.bride || "",
      },
      event: {
        date: createdEvent.date || "",
        ceremonyTime: createdEvent.time || "",
        receptionTime: createdEvent.time || "",
        venueName: createdEvent.location || "",
        venueAddress: createdEvent.location || "",
        mapLink: "",
      },
      contact: {
        phone: createdEvent.contact || "",
      },
      story: createdEvent.note || "",
      gallery: [],
      extras: {
        eventTitle: createdEvent.title || "",
        eventType: createdEvent.type || "",
        eventTheme: createdEvent.theme || "",
        eventActive: createdEvent.active ?? true,
        eventSessions: createdEvent.sessions || [],
      },
    });

    // Set the newly created event as active
    setActiveEventId(draft.id);
    navigate("/dashboard");
  };

  return (
    <CreateEventForm
      onBack={() => navigate("/events")}
      onCreated={handleCreated}
      initialTemplateId={initialTemplateId}
    />
  );
};

export default CreateEventPage
