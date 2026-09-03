import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TemplateExperience from "../experience/TemplateExperience";
import { getTemplateById } from "../data/templatesData";
import { templateService } from "../api/templateService";
import {
    resolveVariant,
    VARIANT_ROUTE_ALIASES,
} from "../experience/config/templateExperienceThemes";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * TemplateDemoPage — public template detail / demo page.
 * Loads live active template data from backend API with local schema support.
 */
export default function TemplateDemoPage() {
    const { id } = useParams();
    const aliasTargetId = VARIANT_ROUTE_ALIASES[id];
    const targetId = aliasTargetId || id;
    const localTpl = useMemo(() => getTemplateById(targetId), [targetId]);
    const [remoteTpl, setRemoteTpl] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        let active = true;
        const fetcher = /^\d+$/.test(targetId)
            ? templateService.getPublic(targetId)
            : templateService.getPublicBySlug(targetId);

        fetcher
            .then((res) => {
                if (active && res) {
                    setRemoteTpl(res);
                }
            })
            .catch(() => {
                // Keep local fallback on network error
            });

        return () => {
            active = false;
        };
    }, [targetId]);

    const tpl = useMemo(() => {
        if (!remoteTpl) return localTpl;
        return {
            ...localTpl,
            id: remoteTpl.code || String(remoteTpl.id) || localTpl.id,
            name: remoteTpl.name || localTpl.name,
            style: remoteTpl.name || localTpl.style,
            description: remoteTpl.description || localTpl.description,
            image: remoteTpl.thumbnailUrl || localTpl.image,
            mainImage: remoteTpl.thumbnailUrl || localTpl.mainImage,
            phoneCoverImage: remoteTpl.thumbnailUrl || localTpl.phoneCoverImage,
            price: remoteTpl.price ?? localTpl.price,
            isPremium: Boolean(remoteTpl.isPremium || remoteTpl.premium),
        };
    }, [localTpl, remoteTpl]);

    const forcedVariant = aliasTargetId ? id : undefined;
    const createTemplatePath = `/create/wedding?template=${tpl.id}`;
    const useTemplateLink = isAuthenticated
        ? createTemplatePath
        : `/login?next=${encodeURIComponent(createTemplatePath)}`;

    const variant = resolveVariant(tpl, forcedVariant);

    return (
        <TemplateExperience
            tpl={tpl}
            useTemplateLink={useTemplateLink}
            variant={variant}
        />
    );
}
