import { useNavigate } from "react-router-dom";
import { useWeddingStore } from "../../../stores/useWeddingStore";

export default function PublishBox({ draft }) {
    const navigate = useNavigate();
    const publishDraft = useWeddingStore((state) => state.publishDraft);

    if (!draft?.id) return null;

    const handlePublish = () => {
        publishDraft();
        navigate("/dashboard");
    };

    return (
        <div className="wb-publish-box">
            <p>បោះផ្សាយសន្លឹកការរបស់អ្នក ហើយទៅផ្ទាំងគ្រប់គ្រង។</p>
            <button type="button" className="wb-btn wb-btn-primary" onClick={handlePublish}>
                បោះផ្សាយ
            </button>
        </div>
    );
}
