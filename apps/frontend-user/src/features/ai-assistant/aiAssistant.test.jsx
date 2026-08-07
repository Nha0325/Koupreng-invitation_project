import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AssistantComposer from "./components/AssistantComposer";
import AssistantResult from "./components/AssistantResult";

vi.mock("@/features/invitations/api/invitationApi", () => ({
  invitationService: {
    get: vi.fn().mockResolvedValue({
      id: 1,
      title: "Dara & Sophea Wedding",
      groomName: "Dara",
      brideName: "Sophea",
      venueName: "Himawari Hotel",
      weddingDate: "2026-03-15",
    }),
    update: vi.fn().mockResolvedValue({ id: 1 }),
  },
}));

describe("AI Invitation Assistant Module", () => {
  describe("AssistantComposer", () => {
    it("renders input fields and submits form data", () => {
      const setForm = vi.fn();
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <AssistantComposer
          form={{
            action: "copy",
            coupleNames: "Dara & Sophea",
            hostName: "Host",
            eventDate: "2026-03-15",
            venueName: "Himawari",
            language: "Khmer",
            tone: "formal",
            notes: "",
          }}
          setForm={setForm}
          loading={false}
          onSubmit={handleSubmit}
        />
      );

      expect(screen.getByDisplayValue("Dara & Sophea")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Himawari")).toBeInTheDocument();
      
      const submitBtn = screen.getByText("✨ រៀបចំអត្ថបទ / Generate Content");
      fireEvent.click(submitBtn);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe("AssistantResult", () => {
    it("renders generated text and handles apply callback", async () => {
      const handleApply = vi.fn();
      const sampleResponse = {
        enabled: true,
        generatedText: "សិរីសួស្តី អាពាហ៍ពិពាហ៍ Dara & Sophea",
        suggestions: ["Keep short for mobile"],
      };

      render(<AssistantResult response={sampleResponse} onApply={handleApply} />);

      expect(screen.getByDisplayValue("សិរីសួស្តី អាពាហ៍ពិពាហ៍ Dara & Sophea")).toBeInTheDocument();
      expect(screen.getByText("Keep short for mobile")).toBeInTheDocument();

      const applyBtn = screen.getByText("យកទៅប្រើក្នុងធៀប / Apply to Invitation");
      fireEvent.click(applyBtn);

      expect(handleApply).toHaveBeenCalledWith("សិរីសួស្តី អាពាហ៍ពិពាហ៍ Dara & Sophea");
    });
  });
});
