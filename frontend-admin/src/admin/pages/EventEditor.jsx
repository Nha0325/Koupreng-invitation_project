import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../shared/AdminContext";
import { eventService } from "../../shared/services/eventService";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { Select } from "../../shared/ui/select";
import { Card } from "../../shared/ui/card";
import { Loader2, Save, ArrowLeft } from "lucide-react";

/**
 * EventEditor
 *
 * CMS builder for editing wedding invitation events.
 * This is the core business feature for the Invitation SaaS Platform.
 *
 * Features:
 * - Edit event details (groom, bride, date, location)
 * - Choose template
 * - Customize colors
 * - Upload images
 * - Upload music
 * - Edit story
 * - Manage schedule
 */
export default function EventEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState({
    groomName: "",
    brideName: "",
    date: "",
    location: "",
    story: "",
    template: "luxury",
    colors: {
      primary: "#7033ff",
      secondary: "#edf0f4",
    },
    schedule: [],
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventById(id);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await eventService.updateEvent(id, event);
      navigate("/admin/events");
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleColorChange = (colorField, value) => {
    setEvent((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorField]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin/events")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Edit Event</h1>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="groomName">Groom Name</Label>
                <Input
                  id="groomName"
                  value={event.groomName}
                  onChange={(e) => handleChange("groomName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="brideName">Bride Name</Label>
                <Input
                  id="brideName"
                  value={event.brideName}
                  onChange={(e) => handleChange("brideName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={event.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={event.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Template Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Template</h2>
            <Select
              value={event.template}
              onValueChange={(value) => handleChange("template", value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select template" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="classic">Classic</Select.Item>
                <Select.Item value="modern">Modern</Select.Item>
                <Select.Item value="luxury">Luxury</Select.Item>
                <Select.Item value="floral">Floral</Select.Item>
              </Select.Content>
            </Select>
          </Card>

          {/* Color Customization */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Colors</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={event.colors.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  type="color"
                  value={event.colors.secondary}
                  onChange={(e) =>
                    handleColorChange("secondary", e.target.value)
                  }
                />
              </div>
            </div>
          </Card>

          {/* Story */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Love Story</h2>
            <Textarea
              value={event.story}
              onChange={(e) => handleChange("story", e.target.value)}
              rows={6}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
