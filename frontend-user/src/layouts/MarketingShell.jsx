/**
 * កំណត់ចំណាំ: Header + Footer + main
 * ឯកសារ: src/layouts/MarketingShell.jsx
 * ចាស់: Header/Footer logic ក្នុង AnimatedRoutes
 */
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header"; // ចាស់: ./layout/Header
import Footer from "./components/Footer"; // ចាស់: ./layout/Footer
import { HIDDEN_MARKETING_LAYOUT_PREFIXES } from "../app/routes";

export default function MarketingShell() {
  const { pathname } = useLocation();

  // ឆែកមើលថា តើ Path បច្ចុប្បន្នស្ថិតក្នុងបញ្ជីដែលត្រូវលាក់ Header ឬទេ
  const isTemplatePreview = pathname.endsWith("/preview");
  const hideChrome = HIDDEN_MARKETING_LAYOUT_PREFIXES.some((p) =>
    pathname.startsWith(p),
  );

  // Auth / Dashboard / Admin / Preview → មិនបង្ហាញ Header Footer
  if (hideChrome || isTemplatePreview) {
    return <Outlet />;
  }

  return (
    <>
      {/* បង្ហាញ Header តែលើទំព័រណាដែលមិនមែនជា Dashboard/Auth/Admin */}
      <Header />

      <main className="main-content-layout">
        <Outlet />
      </main>

      {/* បង្ហាញ Footer តែលើទំព័រណាដែលមិនមែនជា Dashboard/Auth/Admin */}
      <Footer />

      <style>{`
        /* រុញ Content ចុះក្រោមដើម្បីកុំឱ្យ Header Fixed បាំង */
        .main-content-layout {
          padding-top: 85px;
          min-height: 100vh;
        }
      `}</style>
    </>
  );
}
