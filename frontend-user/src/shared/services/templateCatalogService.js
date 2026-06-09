import { api } from "../api/client";

import { unwrap } from "../api/helpers";

export const templateCatalogService = {
    list: () => api.get("/v1/templates").then(unwrap),
};

export default templateCatalogService;
