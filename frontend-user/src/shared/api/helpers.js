export function unwrap(response) {
  return response?.data ?? response;
}

export function toQuery(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getStoredLang() {
  try {
    const value =
      localStorage.getItem("koupreng.lang") ||
      localStorage.getItem("koupreng.locale");

    return value === "en" ? "en" : "km";
  } catch {
    return "km";
  }
}
