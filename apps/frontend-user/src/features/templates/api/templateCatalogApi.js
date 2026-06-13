import { api } from "@/shared/api/httpClient";

import { unwrap } from "@/shared/api/helpers";

export const templateCatalogService = {
    list: () => api.get("/v1/templates", { skipAuth: true }).then(unwrap),
};

export default templateCatalogService;
