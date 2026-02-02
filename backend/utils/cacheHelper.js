export const isNavCacheable = (query = {}) => {
  if (!query || typeof query !== "object") return false;

  const normalize = (v) =>
    typeof v === "string" ? v.trim().toLowerCase() : "";

  // must be collection=all
  if (normalize(query.collection) !== "all") return false;

  // block real filters only
  const blocked = [
    "search",
    "minPrice",
    "maxPrice",
    "size",
    "color",
    "material",
    "brand",
  ];

  for (const key of blocked) {
    if (normalize(query[key]) !== "") return false;
  }

  // allow ONLY page 1
  if (normalize(query.page) && normalize(query.page) !== "1") return false;

  // allow ONLY ONE nav filter
  const navKeys = ["gender", "category"];
  const activeNavKeys = navKeys.filter((k) => normalize(query[k]) !== "");

  return activeNavKeys.length === 1;
};

export const buildNavCacheKey = (query) => {
  const normalize = (v) =>
    typeof v === "string" ? v.trim().toLowerCase() : "";

  if (normalize(query.gender)) {
    return `nav:collection=all|gender=${normalize(query.gender)}`;
  }

  if (normalize(query.category)) {
    return `nav:collection=all|category=${normalize(query.category)}`;
  }

  return null;
};
