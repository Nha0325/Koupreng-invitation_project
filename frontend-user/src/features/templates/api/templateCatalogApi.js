import { api } from "@/services/api/httpClient";

import { unwrap } from "@/services/api/helpers";

export const templateCatalogService = {
    list: () => api.get("/v1/templates", { skipAuth: true }).then(unwrap),
};

export default templateCatalogService;
