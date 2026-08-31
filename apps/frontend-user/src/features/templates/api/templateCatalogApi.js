import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

export const templateCatalogService = {
    list: () =>
        api.get("/v1/templates", { skipAuth: true })
            .then(unwrap)
            .then((items) => {
                const list = Array.isArray(items) ? items : Array.isArray(items?.data) ? items.data : [];
                return list.map((t) => {
                    const isPrem = Boolean(t.premium || t.isPremium || (Number(t.price) > 0));
                    return {
                        ...t,
                        premium: isPrem,
                        isPremium: isPrem,
                    };
                });
            }),
};

export default templateCatalogService;

