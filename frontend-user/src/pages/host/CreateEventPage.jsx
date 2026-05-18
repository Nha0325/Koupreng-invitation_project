import { useNavigate, useSearchParams } from "react-router-dom";
import CreateEventForm from "../../features/events/CreateEventForm";

export default function CreateEventPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    return (
        <CreateEventForm
            onBack={() => navigate("/events")}
            onCreated={() => navigate("/dashboard")}
            initialTemplateId={searchParams.get("template")}
        />
    );
}
