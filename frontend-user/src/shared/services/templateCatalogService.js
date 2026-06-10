import { api } from "../api/client";

function unwrap(response) {
    return response?.data ?? response;
}

export const templateCatalogService = {
    list: () => api.get("/v1/templates").then(unwrap),
};

export default templateCatalogService;
