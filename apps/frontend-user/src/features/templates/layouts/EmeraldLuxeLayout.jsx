import EmeraldLuxeLayoutMaster from "./EmeraldLuxe/EmeraldLuxeLayout";

/**
 * Backward compatibility wrapper.
 * Re-exports the modular EmeraldLuxeLayout.
 */
export default function EmeraldLuxeLayout(props) {
  return <EmeraldLuxeLayoutMaster {...props} />;
}

export { EmeraldLuxeLayoutMaster as EmeraldLuxeLayout };
