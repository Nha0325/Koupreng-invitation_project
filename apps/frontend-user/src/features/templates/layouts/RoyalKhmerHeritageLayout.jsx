import RoyalKhmerLayout from "./RoyalKhmer/RoyalKhmerLayout";

/**
 * Backward compatibility wrapper.
 * Re-exports the modular RoyalKhmerLayout.
 */
export default function RoyalKhmerHeritageLayout(props) {
  return <RoyalKhmerLayout {...props} />;
}

export { RoyalKhmerLayout };
