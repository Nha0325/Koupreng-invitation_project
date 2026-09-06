import DigitalYesLayout from "../templates/layouts/DigitalYes/DigitalYesLayout";

/**
 * Backward compatibility wrapper.
 * Re-exports the modular DigitalYesLayout.
 */
export default function TheDigitalYesInvitation(props) {
  return <DigitalYesLayout {...props} />;
}

export { DigitalYesLayout };
