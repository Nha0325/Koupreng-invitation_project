import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TemplateRenderer from "../TemplateRenderer";
import { Loader2 } from "lucide-react";

/**
 * InvitationPage
 *
 * Dynamic invitation page that renders based on event slug.
 * This is the core public-facing page for the Invitation SaaS Platform.
 *
 * Route: /invitation/:slug
 * Example: /invitation/panha-lyly
 */
export default function InvitationPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch event data by slug
    // In production, this would call the API
    // For now, using mock data
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/events/${slug}`);
        // const data = await response.json();

        // Mock data for demonstration
        const mockEvent = {
          id: "1",
          slug: slug,
          groomName: "Panha",
          brideName: "Lyly",
          date: "2026-05-10",
          location: "Phnom Penh",
          story: "Our love story began in 2020...",
          gallery: [],
          music: "",
          template: "luxury",
          colors: {
            primary: "#7033ff",
            secondary: "#edf0f4",
          },
          schedule: [
            { time: "14:00", event: "Ceremony" },
            { time: "18:00", event: "Reception" },
          ],
        };

        setEvent(mockEvent);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Invitation not found</p>
      </div>
    );
  }

  return <TemplateRenderer event={event} />;
}
