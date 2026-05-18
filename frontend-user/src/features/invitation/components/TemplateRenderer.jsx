/**
 * កំណត់ចំណាំ: render តាម slug
 * ឯកសារ: src/features/invitation/components/TemplateRenderer.jsx
 * ចាស់: ./components/TemplateRenderer.jsx
 */
import { lazy, Suspense } from "react";
import Spinner from "../../../shared/ui/Spinner";

const Classic = lazy(() => import("./templates/Classic"));
const Floral = lazy(() => import("./templates/Floral"));
const Luxury = lazy(() => import("./templates/Luxury"));
const Modern = lazy(() => import("./templates/Modern"));

const REGISTRY = { classic: Classic, floral: Floral, luxury: Luxury, modern: Modern };

/**
 * TemplateRenderer — picks an invitation template by slug and renders it.
 * Templates are lazy-loaded so we only ship the one being viewed.
 */
export default function TemplateRenderer({ template = "classic", data }) {
    const Component = REGISTRY[template] ?? Classic;
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner /></div>}>
            <Component data={data} />
        </Suspense>
    );
}
