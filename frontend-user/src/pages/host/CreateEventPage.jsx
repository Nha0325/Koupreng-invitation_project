import { useNavigate } from "react-router-dom";
import CreateEventForm from "../../features/events/CreateEventForm";

export default function CreateEventPage() {
    const navigate = useNavigate();
    return (
        <CreateEventForm
            onBack={() => navigate("/events")}
            onCreated={() => navigate("/dashboard")}
        />
    );
}
