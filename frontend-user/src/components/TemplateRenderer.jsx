import { lazy, Suspense } from "react";
import Spinner from "./Spinner";

const Classic = lazy(() => import("./invitation/Classic"));
const Floral = lazy(() => import("./invitation/Floral"));
const Luxury = lazy(() => import("./invitation/Luxury"));
const Modern = lazy(() => import("./invitation/Modern"));

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
