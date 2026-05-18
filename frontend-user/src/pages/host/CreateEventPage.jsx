/**
 * កំណត់ចំណាំ: បង្កើតព្រឹត្តិការណ៍
 * ឯកសារ: src/pages/host/CreateEventPage.jsx
 * ចាស់: ./pages/Events/CreateEventPage.jsx
 */
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateEventForm from "../../features/events/components/CreateEventForm";

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
